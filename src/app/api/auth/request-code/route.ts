import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Resend } from 'resend';
import { addMinutes } from 'date-fns';
import { isEmailDomainAllowed, generateAuthCode, getEmailTemplate } from '@/lib/auth/utils';

const resend = new Resend(process.env.RESEND_API_KEY);
const sender = `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`;

export async function POST(request: Request) {
  console.log('🔒 [auth] Starting auth code request');
  try {
    const body = await request.json();
    const { email } = body;
    console.log('📧 [auth] Received request for email:', email);

    if (!email) {
      console.log('❌ [auth] No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email domain is allowed
    if (!isEmailDomainAllowed(email)) {
      console.log('🚫 [auth] Email domain not allowed:', email.split('@')[1]);
      return NextResponse.json(
        { error: 'Email domain not allowed' },
        { status: 403 }
      );
    }
    console.log('✅ [auth] Email domain allowed');

    // Generate a random 6-digit code
    const code = generateAuthCode();
    const expiresAt = addMinutes(new Date(), 15); // Code expires in 15 minutes
    console.log('🎲 [auth] Generated code, expires:', expiresAt.toISOString());

    // Delete any existing codes for this email
    const { error: deleteError } = await supabase
      .from('auth_codes')
      .delete()
      .eq('email', email);
    
    if (deleteError) {
      console.log('⚠️ [auth] Error deleting existing codes:', deleteError);
    } else {
      console.log('🗑️ [auth] Deleted existing codes for email');
    }

    // Store the code in Supabase
    const { error: dbError } = await supabase
      .from('auth_codes')
      .insert([
        {
          email,
          code,
          expires_at: expiresAt.toISOString(),
        },
      ]);

    if (dbError) {
      console.error('❌ [auth] Supabase error storing code:', dbError);
      return NextResponse.json(
        { error: 'Failed to create auth code' },
        { status: 500 }
      );
    }
    console.log('💾 [auth] Stored new auth code in database');

    // Send email with code
    try {
      const template = getEmailTemplate(code);
      const to = process.env.EMAIL_DEV_MODE === 'true' ? 'delivered@resend.dev' : email;
      console.log('📨 [auth] Sending email to:', to);
      
      const emailResponse = await resend.emails.send({
        from: sender,
        to,
        subject: template.subject,
        html: template.html,
      });
      console.log('📬 [auth] Email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('📮 [auth] Email sending error:', emailError);
      // Don't return error to client, but log it
    }

    // In development, return the code for testing
    const response = { 
      message: 'Auth code sent',
      code: process.env.NODE_ENV === 'development' ? code : undefined
    };
    console.log('✨ [auth] Request completed successfully:', {
      ...response,
      email,
      development: process.env.NODE_ENV === 'development'
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 [auth] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 