import { NextResponse } from 'next/server';
import { addComment, getComments } from '@/lib/store';

// Simple ID generator to avoid "uuid" dependency issues
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const comments = await getComments(postId);
    return NextResponse.json(comments);
}

export async function POST(request: Request) {
    try {
        const { postId, author, text } = await request.json();

        if (!postId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newComment = {
            id: generateId(),
            postId,
            author: author || 'Anonymous Fan',
            text: text.trim(),
            timestamp: Date.now(),
        };

        await addComment(newComment);

        return NextResponse.json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
}
