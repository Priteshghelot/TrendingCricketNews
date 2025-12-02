// const fetch = require('node-fetch'); // Native fetch is available in Node 18+

async function verifyProductionPost() {
    const baseUrl = 'https://crictrend.vercel.app';
    const timestamp = Date.now();
    const testHeadline = `Test Post ${timestamp}`;

    console.log(`1. Attempting to create post: "${testHeadline}"...`);

    try {
        // 1. Create Post
        const createRes = await fetch(`${baseUrl}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: testHeadline,
                body: 'This is a test post to verify API functionality.',
                status: 'approved'
            })
        });

        if (!createRes.ok) {
            const text = await createRes.text();
            console.error(`❌ Create Failed: ${createRes.status} ${createRes.statusText}`);
            console.error(`Response: ${text}`);
            return;
        }

        const createData = await createRes.json();
        console.log('✅ Create Success:', createData);

        // 2. Verify it appears in list
        console.log('2. Verifying post appears in list...');
        // Add cache buster
        const listRes = await fetch(`${baseUrl}/api/posts?status=approved&t=${Date.now()}`);
        const listData = await listRes.json();

        const found = listData.posts.find((p: any) => p.content === testHeadline);

        if (found) {
            console.log('✅ Post found in list!');
            console.log('Post ID:', found.id);
        } else {
            console.error('❌ Post NOT found in list!');
            console.log('Total posts returned:', listData.posts.length);
            if (listData.posts.length > 0) {
                console.log('Top post:', listData.posts[0].content);
            }
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    }
}

verifyProductionPost();
