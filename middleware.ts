// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
    const session: any = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/api/error?status=401&message=Not Authorized', request.url))
      }
      return NextResponse.redirect(new URL(`/auth/login?page=${request.nextUrl.pathname}`, request.url));
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
      const validRoles = ['admin', 'SEO', 'super-user'];
      if (!validRoles.includes(session.user.role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log(request);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
};
