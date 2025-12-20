require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');
const fs = require('fs');

async function listPosts() {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    const redis = new Redis(url);
    const data = await redis.get('crictrend:posts');
    if (!data) {
        console.log('No posts');
        return;
    }
    const posts = JSON.parse(data);
    const summary = posts.map(p => ({
        id: p.id,
        title: p.title,
        body: p.body,
        length: p.body.length
    }));
    fs.writeFileSync('posts_summary.json', JSON.stringify(summary, null, 2));
    console.log(`Saved ${summary.length} posts to posts_summary.json`);
    await redis.quit();
}

listPosts().catch(console.error);
