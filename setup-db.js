const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔧 CricTrend Database Setup');
    console.log('═══════════════════════════════════════════════════════\n');

    const envPath = path.join(__dirname, '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Check if credentials already exist
    const hasUrl = envContent.includes('KV_REST_API_URL=');
    const hasToken = envContent.includes('KV_REST_API_TOKEN=');

    if (hasUrl && hasToken) {
        console.log('✅ Database credentials already configured!\n');
        const reconfigure = await question('Do you want to reconfigure? (y/N): ');
        if (reconfigure.toLowerCase() !== 'y') {
            console.log('\nExiting...');
            rl.close();
            return;
        }
    }

    console.log('📋 To get your credentials:');
    console.log('   1. Go to https://vercel.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to Storage tab');
    console.log('   4. Click on your KV database');
    console.log('   5. Go to .env.local tab');
    console.log('   6. Copy the values\n');

    const url = await question('Paste KV_REST_API_URL: ');
    const token = await question('Paste KV_REST_API_TOKEN: ');

    if (!url || !token) {
        console.log('\n❌ Both values are required!');
        rl.close();
        process.exit(1);
    }

    // Update .env.local
    let lines = envContent.split('\n').filter(line => {
        const trimmed = line.trim();
        return !trimmed.startsWith('KV_REST_API_URL=') &&
            !trimmed.startsWith('KV_REST_API_TOKEN=');
    });

    lines.push(`KV_REST_API_URL=${url.trim()}`);
    lines.push(`KV_REST_API_TOKEN=${token.trim()}`);

    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('\n✅ Credentials saved to .env.local');

    // Test connection
    console.log('\n🔍 Testing connection...');
    try {
        const { createClient } = require('@vercel/kv');
        const kv = createClient({
            url: url.trim(),
            token: token.trim()
        });

        await kv.set('test-connection', 'success');
        const result = await kv.get('test-connection');

        if (result === 'success') {
            console.log('✅ Database connection successful!\n');
            console.log('═══════════════════════════════════════════════════════');
            console.log('✨ Setup complete! You can now:');
            console.log('   • Start dev server: npm run dev');
            console.log('   • Visit admin panel: http://localhost:3000/admin');
            console.log('   • Post articles manually');
            console.log('═══════════════════════════════════════════════════════');
        } else {
            throw new Error('Connection test failed');
        }
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('\nPlease verify your credentials and try again.');
    }

    rl.close();
}

main().catch(console.error);
