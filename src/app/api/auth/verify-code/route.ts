import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { addDays } from 'date-fns';

// Default to 7 days if not configured
const SESSION_DURATION_DAYS = process.env.SESSION_DURATION_DAYS ? 
  parseInt(process.env.SESSION_DURATION_DAYS, 10) : 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Find the most recent code for this email
    const { data: authCodes, error: findError } = await supabase
      .from('auth_codes')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (findError || !authCodes?.length) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      );
    }

    const authCode = authCodes[0];

    // Check if code matches and is not expired
    if (authCode.code !== code || new Date(authCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Delete the used code
    const { error: deleteError } = await supabase
      .from('auth_codes')
      .delete()
      .eq('id', authCode.id);

    if (deleteError) {
      console.error('Supabase error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    // Create a new session
    const expiresAt = addDays(new Date(), SESSION_DURATION_DAYS);
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([
        {
          email,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (sessionError) {
      console.error('Supabase error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({ 
      message: 'Code verified',
      session
    });
    response.cookies.set('session_id', session.id, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 