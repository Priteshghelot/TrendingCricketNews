require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

async function checkImages() {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    const redis = new Redis(url);
    const data = await redis.get('crictrend:posts');
    if (!data) return;

    const posts = JSON.parse(data);
    console.log('ID | Image URL | Title');
    console.log('---|-----------|------');
    posts.forEach(p => {
        console.log(`${p.id} | ${p.imageUrl || 'MISSING'} | ${p.title.substring(0, 30)}...`);
    });
    await redis.quit();
}

checkImages().catch(console.error);
