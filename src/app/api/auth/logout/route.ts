import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    // Get the session ID from the cookie
    const sessionId = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('session_id='))
      ?.split('=')[1];

    if (sessionId) {
      // Delete the session from the database
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
      }
    }

    // Create response with cleared cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the session cookie by setting it to expire immediately
    response.cookies.set('session_id', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 