require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

async function testConnection() {
    console.log('🔍 Testing Redis connection with ioredis...\n');

    const url = process.env.KV_URL;
    console.log('KV_URL exists:', !!url);

    if (!url) {
        console.log('❌ KV_URL not found in environment');
        process.exit(1);
    }

    try {
        const redis = new Redis(url);

        // Test write
        await redis.set('test-connection', 'success');
        console.log('✅ Write test passed');

        // Test read
        const result = await redis.get('test-connection');
        console.log('✅ Read test passed');
        console.log('   Result:', result);

        if (result === 'success') {
            console.log('\n✅ Database connection successful!');
            console.log('\nYou can now:');
            console.log('  • Start dev server: npm run dev');
            console.log('  • Visit admin: http://localhost:3000/admin');
            console.log('  • Post articles manually');
        } else {
            console.log('⚠️ Connection works but data mismatch');
        }

        await redis.quit();
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('\nPlease verify your Redis URL is correct.');
        process.exit(1);
    }
}

testConnection();
