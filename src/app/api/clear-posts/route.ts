import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const POSTS_KEY = 'crictrend:posts';

export async function POST() {
    try {
        // Clear all posts from KV (Hash)
        await kv.del('crictrend:posts_hash');
        // Also clear old key just in case
        await kv.del(POSTS_KEY);

        return NextResponse.json({
            success: true,
            message: 'All posts cleared from database'
        });
    } catch (error) {
        console.error('Error clearing posts:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to clear posts'
        }, { status: 500 });
    }
}
