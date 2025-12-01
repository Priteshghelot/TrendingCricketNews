import { NextResponse } from 'next/server';
import { getPosts, Post } from '@/lib/store';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

export async function GET() {
    try {
        const allPosts = await getPosts();

        // Remove duplicates based on title (content field) and source URL
        const uniquePosts: Post[] = [];
        const seenTitles = new Set<string>();
        const seenUrls = new Set<string>();

        for (const post of allPosts) {
            const titleKey = post.content.toLowerCase().trim();
            const urlKey = post.sourceUrl || '';

            // Skip if we've seen this title or URL before
            if (seenTitles.has(titleKey) || (urlKey && seenUrls.has(urlKey))) {
                console.log(`Removing duplicate: ${post.content}`);
                continue;
            }

            seenTitles.add(titleKey);
            if (urlKey) seenUrls.add(urlKey);
            uniquePosts.push(post);
        }

        const removedCount = allPosts.length - uniquePosts.length;

        // Save the deduplicated posts
        if (removedCount > 0) {
            try {
                const dir = path.dirname(DATA_FILE);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(DATA_FILE, JSON.stringify(uniquePosts, null, 2));
                console.log(`Removed ${removedCount} duplicate posts`);
            } catch (error) {
                console.error('Error saving deduplicated posts:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Removed ${removedCount} duplicate posts`,
            totalPosts: uniquePosts.length,
            removedCount
        });
    } catch (error) {
        console.error('Deduplication error:', error);
        return NextResponse.json({ error: 'Failed to remove duplicates' }, { status: 500 });
    }
}
