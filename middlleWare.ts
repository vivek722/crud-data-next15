import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const isProtected = request.nextUrl.pathname.startsWith('/dashboard');
    
    if (isProtected && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  