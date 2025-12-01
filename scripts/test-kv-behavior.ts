import { kv } from '@vercel/kv';
import { addPost, getPosts, Post } from '../src/lib/kv-store';
import { v4 as uuidv4 } from 'uuid';

async function testKVBehavior() {
    console.log('Starting KV Behavior Test...');

    try {
        // 1. Get initial count
        console.log('1. Fetching initial posts...');
        const initialPosts = await getPosts(true);
        console.log(`Initial post count: ${initialPosts.length}`);

        // 2. Add first test post
        const post1: Post = {
            id: uuidv4(),
            content: 'Test Post 1',
            status: 'approved',
            timestamp: Date.now(),
            body: 'Body 1'
        };
        console.log('2. Adding Post 1...');
        await addPost(post1);

        // 3. Verify Post 1 exists
        const postsAfter1 = await getPosts(true);
        console.log(`Post count after Post 1: ${postsAfter1.length}`);
        const found1 = postsAfter1.find(p => p.id === post1.id);
        if (!found1) {
            console.error('❌ CRITICAL: Post 1 not found after adding!');
        } else {
            console.log('✅ Post 1 found.');
        }

        // 4. Add second test post
        const post2: Post = {
            id: uuidv4(),
            content: 'Test Post 2',
            status: 'approved',
            timestamp: Date.now(),
            body: 'Body 2'
        };
        console.log('3. Adding Post 2...');
        await addPost(post2);

        // 5. Verify BOTH posts exist
        const postsAfter2 = await getPosts(true);
        console.log(`Post count after Post 2: ${postsAfter2.length}`);

        const found1Again = postsAfter2.find(p => p.id === post1.id);
        const found2 = postsAfter2.find(p => p.id === post2.id);

        if (found1Again && found2) {
            console.log('✅ SUCCESS: Both posts exist. No data loss detected.');
        } else {
            console.error('❌ FAILURE: Data loss detected!');
            if (!found1Again) console.error('   - Post 1 is MISSING (Old post deleted)');
            if (!found2) console.error('   - Post 2 is MISSING (New post failed)');
        }

        // Cleanup
        console.log('Cleaning up test posts...');
        // We won't delete them to allow manual inspection if needed, 
        // or we can delete specifically these two.
        // For now, let's leave them or user can use the clear-posts API.

    } catch (error) {
        console.error('❌ Test crashed:', error);
    }
}

testKVBehavior();
