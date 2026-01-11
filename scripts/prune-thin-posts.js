const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

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

async function prunePosts() {
    console.log('🧹 Starting Prune of Thin Content...');

    if (!KV_URL) {
        console.error('❌ KV_URL/REDIS_URL not found.');
        return;
    }

    const redis = new Redis(KV_URL);
    const POSTS_KEY = 'crictrend:posts';

    try {
        const rawPosts = await redis.get(POSTS_KEY);
        let posts = [];
        try {
            posts = rawPosts ? JSON.parse(rawPosts) : [];
        } catch (e) {
            console.log('Error parsing posts JSON');
            redis.disconnect();
            return;
        }

        if (!Array.isArray(posts)) {
            console.log('No posts found (or not an array).');
            redis.disconnect();
            return;
        }

        const initialCount = posts.length;
        console.log(`Analyzing ${initialCount} posts...`);

        // Filter out thin posts (Keep posts > 1000 chars)
        const validPosts = posts.filter(post => {
            const len = (post.body || '').length;
            const keep = len >= 1000;
            if (!keep) {
                console.log(`🗑️  Deleting: "${post.title}" (${len} chars)`);
            }
            return keep;
        });

        const deletedCount = initialCount - validPosts.length;

        if (deletedCount > 0) {
            console.log(`\nFound ${deletedCount} thin posts to delete.`);
            // Update KV using redis instance
            await redis.set(POSTS_KEY, JSON.stringify(validPosts));
            console.log(`✅ Pruning Complete. Remaining Posts: ${validPosts.length}`);
        } else {
            console.log('✅ No thin posts found (or database empty).');
        }

        await redis.quit();

    } catch (error) {
        console.error('❌ Pruning failed:', error);
        redis.disconnect();
    }
}

prunePosts();
