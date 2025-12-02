import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Post } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // 1. Get data from Hash (Where data was moved to)
        const hashData = await kv.hgetall<Record<string, Post>>('crictrend:posts_hash');
        const hashPosts = hashData ? Object.values(hashData) : [];

        // 2. Get data from List (Where data is now supposed to be)
        const listData = await kv.get<Post[]>('crictrend:posts');
        const listPosts = Array.isArray(listData) ? listData : [];

        // 3. Merge and Deduplicate
        const allPostsMap = new Map<string, Post>();

        // Add hash posts first
        hashPosts.forEach(p => allPostsMap.set(p.id, p));

        // Add list posts (overwriting hash posts if newer/duplicate, though usually we want to keep both if IDs differ)
        // If IDs match, which one to keep? 
        // Let's assume List has "newer" edits since revert, so keep List.
        listPosts.forEach(p => allPostsMap.set(p.id, p));

        const mergedPosts = Array.from(allPostsMap.values());

        // 4. Sort by timestamp (newest first)
        mergedPosts.sort((a, b) => b.timestamp - a.timestamp);

        // 5. Save back to List
        await kv.set('crictrend:posts', mergedPosts);

        return NextResponse.json({
            success: true,
            message: 'Data migrated back from Hash to List',
            stats: {
                hashCount: hashPosts.length,
                listCount: listPosts.length,
                mergedCount: mergedPosts.length
            },
            sample: mergedPosts.slice(0, 3)
        });
    } catch (error) {
        return NextResponse.json({
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
