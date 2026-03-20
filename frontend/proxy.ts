import { NextResponse, NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

export async function proxy(request: NextRequest){
    try {
        const accessToken: string | null = request.cookies.get('accessToken')?.value || null
        if (!accessToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        const payload = decodeJwt(accessToken)
        const url = new URL(request.url);
        
        if (payload.role !== 'admin' && url.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/student/jobs', request.url));
        } else {
            return NextResponse.next();
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/student/:path*', '/admin/:path*'],
}
