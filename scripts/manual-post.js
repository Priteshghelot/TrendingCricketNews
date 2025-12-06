const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { createClient } = require('@vercel/kv'); // Ensure this is installed

const envPath = path.join(process.cwd(), '.env.local');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Manually load env vars
function loadEnv() {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valParts] = trimmed.split('=');
                const val = valParts.join('=');
                if (key && val) {
                    process.env[key.trim()] = val.trim();
                }
            }
        });
    }
}

async function main() {
    console.log('🚀 Manual Article Publisher Script');
    console.log('----------------------------------');

    loadEnv();

    let url = process.env.KV_REST_API_URL;
    let token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
        console.log('⚠️  Vercel KV credentials not found in environment.');
        console.log('You can find these in Vercel Dashboard > Storage > Settings > .env.local\n');

        url = await question('Enter KV_REST_API_URL: ');
        token = await question('Enter KV_REST_API_TOKEN: ');

        if (url && token) {
            process.env.KV_REST_API_URL = url;
            process.env.KV_REST_API_TOKEN = token;

            const save = await question('Do you want to save these to .env.local? (y/N): ');
            if (save.toLowerCase() === 'y') {
                try {
                    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
                    if (!content.includes('KV_REST_API_URL')) content += `\nKV_REST_API_URL=${url}`;
                    if (!content.includes('KV_REST_API_TOKEN')) content += `\nKV_REST_API_TOKEN=${token}`;
                    fs.writeFileSync(envPath, content);
                    console.log('✅ Saved to .env.local');
                } catch (e) {
                    console.error('Failed to save .env.local:', e);
                }
            }
        } else {
            console.error('❌ Credentials required to proceed. Exiting.');
            process.exit(1);
        }
    }

    // Initialize KV Client
    const kv = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });

    try {
        // Test connection
        await kv.set('test-connection-script', 'ok');
        const test = await kv.get('test-connection-script');
        if (test !== 'ok') throw new Error('KV connection verification failed.');
        console.log('✅ Connected to Vercel KV!');
    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
        console.error('Check your URL and Token.');
        process.exit(1);
    }

    console.log('\n✍️  Create New Post');
    const title = await question('Title: ');
    const body = await question('Body: ');
    const imageUrl = await question('Image URL (optional): ');

    if (!title || !body) {
        console.error('❌ Title and Body are required.');
        process.exit(1);
    }

    const newPost = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        title,
        body,
        imageUrl: imageUrl || '',
        status: 'approved',
        timestamp: Date.now(),
    };

    try {
        // MATCHING LOGIC FROM src/lib/store.ts
        const POSTS_KEY = 'crictrend:posts'; // Ensure this matches!

        // We must implement getPosts logic here to prepend
        const posts = await kv.get(POSTS_KEY);
        const postList = Array.isArray(posts) ? posts : [];

        postList.unshift(newPost);
        await kv.set(POSTS_KEY, postList);

        console.log('\n✅ Post Published Successfully!');
        console.log(`ID: ${newPost.id}`);
        console.log(`Title: ${newPost.title}`);

    } catch (e) {
        console.error('❌ Failed to publish post:', e);
    } finally {
        rl.close();
    }
}

main().catch(console.error);
