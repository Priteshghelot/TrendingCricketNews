
// Mock KV Store
const mockDB = {
    list: [] as any[],
    hash: {} as Record<string, any>
};

// Simulate Network Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- OLD WAY (The Bug) ---
async function oldAddPost(post: any) {
    // 1. Read all posts
    const currentPosts = [...mockDB.list];

    // Simulate network delay (critical for race condition)
    await delay(100);

    // 2. Add new post
    currentPosts.unshift(post);

    // 3. Save all posts (Overwriting what was there)
    mockDB.list = currentPosts;
}

// --- NEW WAY (The Fix) ---
async function newAddPost(post: any) {
    // 1. Atomic Set (HSET) - No reading required!
    // We just add/update this specific key in the hash
    mockDB.hash[post.id] = post;
    await delay(50); // Delay doesn't matter here because we aren't overwriting the whole object
}

async function runSimulation() {
    console.log('🧪 STARTING RACE CONDITION SIMULATION\n');

    // SCENARIO 1: The Bug (Old Way)
    console.log('--- SCENARIO 1: The Bug (List Storage) ---');
    mockDB.list = []; // Reset

    console.log('1. User starts adding "Post A"...');
    const promiseA = oldAddPost({ id: 'A', content: 'Post A' });

    console.log('2. Cron Job starts adding "Post B" (at the same time)...');
    const promiseB = oldAddPost({ id: 'B', content: 'Post B' });

    await Promise.all([promiseA, promiseB]);

    console.log('3. Result:');
    console.log(JSON.stringify(mockDB.list, null, 2));

    if (mockDB.list.length === 1) {
        console.log('❌ DATA LOSS DETECTED! One post overwrote the other.\n');
    } else {
        console.log('✅ Lucky! No data loss (this time).\n');
    }

    // SCENARIO 2: The Fix (New Way)
    console.log('--- SCENARIO 2: The Fix (Hash Storage) ---');
    mockDB.hash = {}; // Reset

    console.log('1. User starts adding "Post A"...');
    const promiseC = newAddPost({ id: 'A', content: 'Post A' });

    console.log('2. Cron Job starts adding "Post B" (at the same time)...');
    const promiseD = newAddPost({ id: 'B', content: 'Post B' });

    await Promise.all([promiseC, promiseD]);

    console.log('3. Result:');
    console.log(JSON.stringify(mockDB.hash, null, 2));

    if (Object.keys(mockDB.hash).length === 2) {
        console.log('✅ SUCCESS! Both posts preserved. No race condition.\n');
    } else {
        console.log('❌ FAILURE! Data loss detected.\n');
    }
}

runSimulation();
