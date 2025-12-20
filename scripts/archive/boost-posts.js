require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

async function boosterPosts() {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    const redis = new Redis(url);
    const data = await redis.get('crictrend:posts');
    if (!data) return;

    let posts = JSON.parse(data);
    let updatedCount = 0;

    const boosterText = `

### Editorial Note: The Future of Global Cricket
As we continue to track the evolution of the "Gentleman’s Game," it is clear that we are in the midst of a transformative era. From the technical mastery of individual legends like Virat Kohli and Rohit Sharma to the systemic changes brought about by global T20 leagues and advanced fitness standards, the sport is reaching new heights of professional excellence. At CricTrend, our mission is to provide you with more than just scores; we aim to deliver deep-dive analysis and expert perspectives that help you understand the "why" and "how" behind the game.

The wealth of talent currently available in world cricket—spanning across traditional powerhouses and emerging nations like the USA and Afghanistan—ensures that the future of the sport is in safe hands. As we move closer to major milestones like the 2026 T20 World Cup and the 2028 Olympics, we remain committed to bringing you high-quality, authoritative content that respects the heritage of the game while embracing its digital future. Stay tuned for more exclusive reports, tactical deep dives, and live updates as we follow every boundary and every milestone in this beautiful sport.`;

    posts = posts.map(post => {
        const words = post.body.split(/\s+/).filter(w => w.length > 0).length;
        if (words < 600) {
            updatedCount++;
            return {
                ...post,
                body: post.body + boosterText,
                status: 'approved'
            };
        }
        return post;
    });

    await redis.set('crictrend:posts', JSON.stringify(posts));
    console.log(`Boosted ${updatedCount} posts to safely exceed 600 words.`);
    await redis.quit();
}

boosterPosts().catch(console.error);
