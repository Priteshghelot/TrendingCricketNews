import { NextResponse } from 'next/server';
import { getPosts, updatePostStatus, deletePost, Post } from '@/lib/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let posts = getPosts();

    if (status) {
        posts = posts.filter((p) => p.status === status);
    }

    // Sort by timestamp descending (newest first), then by ID for stable ordering
    posts.sort((a, b) => {
        // First, sort by timestamp (newest first)
        if (b.timestamp !== a.timestamp) {
            return b.timestamp - a.timestamp;
        }
        // If timestamps are equal, sort by ID (descending = newest first)
        return b.id.localeCompare(a.id);
    });

    return NextResponse.json({ posts });
}

export async function PUT(request: Request) {
    try {
        const bodyData = await request.json();
        const { id, status, content, highlights, body, imageUrl } = bodyData;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        updatePostStatus(id, status as Post['status'], status === 'approved', {
            content,
            highlights,
            body,
            imageUrl
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const success = deletePost(id);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
