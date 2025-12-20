require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

async function analyzePosts() {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    if (!url) {
        console.error('Database URL missing');
        return;
    }

    const redis = new Redis(url);
    const postsJson = await redis.get('crictrend:posts');
    if (!postsJson) {
        console.log('No posts found');
    } else {
        const posts = JSON.parse(postsJson);
        console.log(`Total Posts: ${posts.length}`);

        const approvedPosts = posts.filter(p => p.status === 'approved');
        console.log(`Approved Posts: ${approvedPosts.length}`);

        if (approvedPosts.length > 0) {
            const avgLength = approvedPosts.reduce((acc, p) => acc + p.body.length, 0) / approvedPosts.length;
            console.log(`Average Body Length: ${avgLength.toFixed(0)} characters`);

            const shortPosts = approvedPosts.filter(p => p.body.length < 500);
            console.log(`Posts under 500 characters: ${shortPosts.length}`);

            console.log('\nSample Titles:');
            approvedPosts.slice(0, 5).forEach(p => console.log(`- ${p.title} (${p.body.length} chars)`));
        }
    }
    await redis.quit();
}

analyzePosts();
