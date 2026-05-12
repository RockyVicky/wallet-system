import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3001';

export function middleware(request: NextRequest) {
  // Proxy /api-backend requests to the actual backend
  if (request.nextUrl.pathname.startsWith('/api-backend')) {
    const targetUrl = new URL(request.nextUrl.pathname.replace('/api-backend', ''), backendInternalUrl);
    targetUrl.search = request.nextUrl.search;
    
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api-backend/:path*',
};
