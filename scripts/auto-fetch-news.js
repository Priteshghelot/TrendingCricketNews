const Redis = require('ioredis');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const RSS_FEEDS = [
    'https://static.cricinfo.com/rss/livescores.xml', // Live Scores as news? Maybe not.
    'http://www.espncricinfo.com/rss/content/story/feeds/0.xml', // Main Stories
];

// Manually load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, ...val] = line.trim().split('=');
        if (key && val) process.env[key] = val.join('=').trim();
    });
}

const KV_URL = process.env.KV_REST_API_URL || process.env.KV_URL || process.env.REDIS_URL;

async function fetchAndAggregate() {
    console.log('🗞️  Starting Smart News Aggregation...');

    if (!KV_URL) {
        console.error('❌ KV_URL not found.');
        return;
    }

    const parser = new Parser();
    const redis = new Redis(KV_URL);
    const POSTS_KEY = 'crictrend:posts';

    try {
        let allItems = [];

        // 1. Fetch all feeds
        for (const url of RSS_FEEDS) {
            try {
                const feed = await parser.parseURL(url);
                console.log(`✅ Fetched ${feed.items.length} items from ${url}`);
                allItems = [...allItems, ...feed.items];
            } catch (e) {
                console.error(`❌ Failed to fetch ${url}:`, e.message);
            }
        }

        if (allItems.length === 0) {
            console.log('No news items found.');
            await redis.quit();
            return;
        }

        // 2. Group by "Series" or "Topic" (Naive implementation: Group by duplicate words in title?)
        // Better: Create one "Daily Cricket Round-Up" post for today.

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const postTitle = `Cricket Daily Round-Up: ${today}`;

        // Check if we already have a post for today
        const rawPosts = await redis.get(POSTS_KEY);
        const currentPosts = rawPosts ? JSON.parse(rawPosts) : [];
        if (!Array.isArray(currentPosts)) throw new Error('Invalid DB state');

        const existingPostIndex = currentPosts.findIndex(p => p.title === postTitle);

        // 3. Build Body
        let body = `Here is your daily digest of the most important cricket action happening around the world today, ${today}.\n\n`;

        // Sort by date (newest first) and take top 10 unique
        const uniqueItems = [];
        const seenTitles = new Set();

        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        for (const item of allItems) {
            if (seenTitles.has(item.title)) continue;
            seenTitles.add(item.title);
            uniqueItems.push(item);
            if (uniqueItems.length >= 7) break; // Aggregating top 7 stories
        }

        uniqueItems.forEach((item, index) => {
            const snippet = item.contentSnippet || item.content || 'Read full story...';
            // Clean snippet
            const cleanSnippet = snippet.replace(/<[^>]*>?/gm, '').substring(0, 300);

            body += `### ${index + 1}. ${item.title}\n`;
            body += `${cleanSnippet}...\n`;
            // Add attribution/link? AdSense might prefer NO external links if possible, or yes?
            // "Read more at source" is good for E-E-A-T.
            // body += `[Read Full Story](${item.link})\n\n`;
            body += `\n**Insight:** Catch all the action live on CricTrend.\n\n`;
            body += `---\n\n`;
        });

        body += `\n*Stay tuned to CricTrend for real-time updates and ball-by-ball commentary.*\n`;

        // 4. Save/Update Post
        const newPost = {
            id: existingPostIndex !== -1 ? currentPosts[existingPostIndex].id : Date.now().toString(),
            title: postTitle,
            body: body,
            imageUrl: uniqueItems[0]?.enclosure?.url || '', // Use image from top story
            status: 'approved',
            timestamp: Date.now(),
        };

        if (existingPostIndex !== -1) {
            console.log('🔄 Updating existing Daily Digest...');
            currentPosts[existingPostIndex] = newPost;
        } else {
            console.log('🆕 Creating new Daily Digest...');
            currentPosts.unshift(newPost);
        }

        await redis.set(POSTS_KEY, JSON.stringify(currentPosts));
        console.log('✅ Daily Digest Published!');

    } catch (error) {
        console.error('❌ Aggregation failed:', error);
    } finally {
        await redis.quit();
    }
}

fetchAndAggregate();
