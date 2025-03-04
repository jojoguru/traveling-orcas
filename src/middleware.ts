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
  // Allow access to static assets and public images
  if (request.nextUrl.pathname.startsWith('/bb-orcas/')) {
    return NextResponse.next();
  }

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
  // Include both pathname and search params in the callback URL
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
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
     * - bb-orcas folder (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|bb-orcas/).*)',
  ],
};

