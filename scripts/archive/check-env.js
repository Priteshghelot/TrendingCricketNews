const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

try {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        console.log('Read .env.local successfully.');

        const lines = content.split('\n');
        let hasUrl = false;
        let hasToken = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('KV_REST_API_URL=')) {
                const val = trimmed.substring('KV_REST_API_URL='.length);
                if (val && val.length > 0) {
                    hasUrl = true;
                    console.log(`KV_REST_API_URL found. Length: ${val.length}`);
                }
            }
            if (trimmed.startsWith('KV_REST_API_TOKEN=')) {
                const val = trimmed.substring('KV_REST_API_TOKEN='.length);
                if (val && val.length > 0) {
                    hasToken = true;
                    console.log(`KV_REST_API_TOKEN found. Length: ${val.length}`);
                }
            }
        });

        if (hasUrl && hasToken) {
            console.log('✅ Both KV variables are present locally.');
        } else {
            console.log('❌ Missing KV variables in .env.local');
            console.log(`Debug content length: ${content.length}`);
            console.log(`Content preview: ${content.substring(0, 50)}...`);
        }

    } else {
        console.log('❌ .env.local does not exist.');
    }
} catch (err) {
    console.error('Error reading .env.local:', err);
}
