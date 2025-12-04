import { NextResponse } from 'next/server';
import { getPosts, addPost, updatePost, deletePost, Post } from '@/lib/store';

export const dynamic = 'force-dynamic';

// GET all posts
export async function GET() {
    const posts = await getPosts();
    return NextResponse.json({ posts });
}

// CREATE a new post
export async function POST(request: Request) {
    try {
        const { title, body, imageUrl, status } = await request.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
        }

        const newPost: Post = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            title,
            body,
            imageUrl: imageUrl || '',
            status: status || 'pending',
            timestamp: Date.now(),
        };

        await addPost(newPost);

        // Force cache invalidation for the homepage
        try {
            const { revalidatePath } = await import('next/cache');
            revalidatePath('/');
        } catch (e) {
            console.error('Revalidation failed:', e);
        }

        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// UPDATE a post
export async function PUT(request: Request) {
    try {
        const { id, ...updates } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await updatePost(id, updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE a post
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await deletePost(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
