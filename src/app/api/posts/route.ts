import { NextResponse } from 'next/server';
import { getPosts, updatePostStatus, Post } from '@/lib/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let posts = getPosts();

    if (status) {
        posts = posts.filter((p) => p.status === status);
    }

    // Sort by timestamp descending
    posts.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ posts });
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        updatePostStatus(id, status as Post['status'], status === 'approved');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
