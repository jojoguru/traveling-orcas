import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// List of public paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/verify',
  '/auth/error',
];

export async function middleware(request: NextRequest) {
  // Check if the path is public
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if it's an API route for authentication
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  const sessionId = request.cookies.get('session_id')?.value;
  
  if (!sessionId) {
    return redirectToLogin(request);
  }
  // Verify session
  const { data: session, error } = await supabase
  .from('sessions')
  .select('*')
  .eq('id', sessionId)
  .gt('expires_at', new Date().toISOString())
  .single();
  
  if (error || !session) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

