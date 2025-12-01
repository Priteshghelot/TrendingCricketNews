import { NextResponse } from 'next/server';
import { addPost, Post } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const testPost: Post = {
            id: 'test-' + Date.now(),
            content: '🔔 Test Post from System',
            highlights: 'This is a test post to verify the new Redis Hash storage system.',
            body: 'If you can see this, the database is working correctly! This post was created via the debug API.',
            imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?w=800&auto=format&fit=crop&q=60',
            status: 'approved',
            timestamp: Date.now(),
            sourceUrl: 'https://crictrend.vercel.app',
            keywords: ['test', 'debug', 'system']
        };

        await addPost(testPost);

        return NextResponse.json({
            success: true,
            message: 'Test post created successfully!',
            post: testPost
        });
    } catch (error) {
        console.error('Debug creation failed:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
