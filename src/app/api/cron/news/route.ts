import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { kv } from '@/lib/store'; // Reuse existing KV client
import { Post } from '@/lib/store';

// --- Configuration ---
const RSS_FEEDS = [
    'https://static.cricinfo.com/rss/livescores.xml',
    'http://www.espncricinfo.com/rss/content/story/feeds/0.xml',
];

export async function GET(request: Request) {
    // Optional: Security Check (Vercel Cron automatically adds this header)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse('Unauthorized', { status: 401 });
    // }

    console.log('🗞️  Starting Cron: Smart News Aggregation...');
    const parser = new Parser();
    const POSTS_KEY = 'crictrend:posts';

    try {
        let allItems: any[] = [];

        // 1. Fetch all feeds
        for (const url of RSS_FEEDS) {
            try {
                const feed = await parser.parseURL(url);
                console.log(`✅ Fetched ${feed.items.length} items from ${url}`);
                allItems = [...allItems, ...feed.items];
            } catch (e: any) {
                console.error(`❌ Failed to fetch ${url}:`, e.message);
            }
        }

        if (allItems.length === 0) {
            return NextResponse.json({ message: 'No news items found.' });
        }

        // 2. Prepare "Daily Round-Up"
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kolkata' // Ensure consistency with user's timezone
        });
        const postTitle = `Cricket Daily Round-Up: ${today}`;

        // Fetch existing posts
        const rawPosts = await kv.get(POSTS_KEY);
        let currentPosts: Post[] = [];

        if (typeof rawPosts === 'string') {
            try {
                currentPosts = JSON.parse(rawPosts);
            } catch (e) {
                currentPosts = [];
            }
        } else if (Array.isArray(rawPosts)) {
            currentPosts = rawPosts;
        }

        const existingPostIndex = currentPosts.findIndex((p: any) => p.title === postTitle);

        // 3. Build Body
        let body = `Here is your daily digest of the most important cricket action happening around the world today, ${today}.\n\n`;

        // Sort by date (newest first) and take top 10 unique
        const uniqueItems: any[] = [];
        const seenTitles = new Set();

        // RSS items usually have pubDate.
        allItems.sort((a, b) => {
            const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return dateB - dateA;
        });

        for (const item of allItems) {
            if (seenTitles.has(item.title)) continue;
            seenTitles.add(item.title);
            uniqueItems.push(item);
            if (uniqueItems.length >= 7) break;
        }

        uniqueItems.forEach((item, index) => {
            const snippet = item.contentSnippet || item.content || 'Read full story...';
            const cleanSnippet = snippet.replace(/<[^>]*>?/gm, '').substring(0, 300);

            body += `### ${index + 1}. ${item.title}\n`;
            body += `${cleanSnippet}...\n`;
            body += `\n**Insight:** Catch all the action live on CricTrend.\n\n`;
            body += `---\n\n`;
        });

        body += `\n*Stay tuned to CricTrend for real-time updates and ball-by-ball commentary.*\n`;

        // 4. Save/Update Post
        const newPost: Post = {
            id: existingPostIndex !== -1 ? currentPosts[existingPostIndex].id : Date.now().toString(),
            title: postTitle,
            body: body,
            imageUrl: uniqueItems[0]?.enclosure?.url || '',
            status: 'approved',
            timestamp: Date.now(),
        };

        if (existingPostIndex !== -1) {
            currentPosts[existingPostIndex] = newPost;
        } else {
            currentPosts.unshift(newPost);
        }

        // Use standard redis set
        await kv.set(POSTS_KEY, JSON.stringify(currentPosts));

        return NextResponse.json({ success: true, message: 'Daily Digest Published!', title: postTitle });

    } catch (error: any) {
        console.error('❌ Aggregation failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
