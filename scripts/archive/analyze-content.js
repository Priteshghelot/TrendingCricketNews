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

            const shortPostsByWords = approvedPosts.filter(p => p.body.split(/\s+/).filter(w => w.length > 0).length < 600);
            console.log(`Posts under 600 words: ${shortPostsByWords.length}`);

            console.log('\nDetailed Breakdown (Shortest first):');
            const sortedByWords = [...approvedPosts].sort((a, b) => {
                const wa = a.body.split(/\s+/).filter(w => w.length > 0).length;
                const wb = b.body.split(/\s+/).filter(w => w.length > 0).length;
                return wa - wb;
            });

            sortedByWords.slice(0, 10).forEach(p => {
                const words = p.body.split(/\s+/).filter(w => w.length > 0).length;
                console.log(`- [${words} words] ${p.title}`);
            });
        }
    }
    await redis.quit();
}

analyzePosts();
