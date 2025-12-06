const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const redisUrl = 'redis://default:HoyZoAFQ5vpvDoD68qTSTy5X8ywnLh72@redis-10684.c61.us-east-1-3.ec2.cloud.redislabs.com:10684';

// Read current content
let content = '';
if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
}

// Remove any existing KV_URL lines and clean up corrupted data
const lines = content.split('\n')
    .filter(line => !line.includes('KV_URL') && !line.includes('\u0000'))
    .map(line => line.trim())
    .filter(line => line.length > 0);

// Add the Redis URL
lines.push('');
lines.push('# Redis Database Connection');
lines.push(`KV_URL=${redisUrl}`);

// Write back
fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf8');

console.log('✅ Successfully added KV_URL to .env.local');
console.log('\nCurrent .env.local content:');
console.log(fs.readFileSync(envPath, 'utf8'));
