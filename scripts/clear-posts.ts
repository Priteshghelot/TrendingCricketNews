import { kv } from '@vercel/kv';

const POSTS_KEY = 'crictrend:posts';

async function clearAllPosts() {
    try {
        await kv.set(POSTS_KEY, []);
        console.log('✅ All posts cleared from KV database');
    } catch (error) {
        console.error('❌ Error clearing posts:', error);
    }
}

clearAllPosts();
