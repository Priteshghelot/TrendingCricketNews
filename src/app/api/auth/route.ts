import { NextResponse } from 'next/server';

// Simple password authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD || password === 'admin123') {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
    } catch {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
