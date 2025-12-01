import { NextResponse } from 'next/server';
import { getPosts, deletePost } from '@/lib/store';

export async function POST() {
    try {
        const posts = await getPosts();
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

        let deletedCount = 0;
        const postsToKeep = [];
        const postsToDelete = [];

        // Separate posts into keep and delete
        for (const post of posts) {
            if (post.timestamp < thirtyDaysAgo && post.status !== 'approved') {
                postsToDelete.push(post);
            } else {
                postsToKeep.push(post);
            }
        }

        // Keep at least 100 posts even if they're old
        if (postsToKeep.length < 100) {
            const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
            const additionalPosts = sortedPosts.slice(0, 100);
            postsToDelete.length = 0;

            for (const post of posts) {
                if (!additionalPosts.find(p => p.id === post.id)) {
                    postsToDelete.push(post);
                }
            }
        }

        // Delete old posts
        for (const post of postsToDelete) {
            await deletePost(post.id);
            deletedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${deletedCount} old posts`,
            deletedCount,
            remainingPosts: posts.length - deletedCount
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Failed to cleanup posts' },
            { status: 500 }
        );
    }
}

export async function GET() {
    const posts = await getPosts();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const oldPosts = posts.filter(p => p.timestamp < thirtyDaysAgo);
    const recentPosts = posts.filter(p => p.timestamp >= thirtyDaysAgo);

    return NextResponse.json({
        totalPosts: posts.length,
        oldPosts: oldPosts.length,
        recentPosts: recentPosts.length,
        oldestPost: posts.length > 0 ? new Date(Math.min(...posts.map(p => p.timestamp))).toLocaleDateString() : null,
        newestPost: posts.length > 0 ? new Date(Math.max(...posts.map(p => p.timestamp))).toLocaleDateString() : null
    });
}
