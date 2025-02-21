import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = NextResponse.json({ message: 'Successfully logged out' }, { status: 200 });
        response.cookies.delete('token');
        return response;
    } catch {
        return NextResponse.json({ error: 'Unknown exception while checking token' }, { status: 500 });
    }
}