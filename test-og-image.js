// const fetch = require('node-fetch'); // Native fetch used

async function testImageFetching() {
    const urls = [
        'https://www.espncricinfo.com/story/ipl-2024-rcb-vs-csk-match-report-1426567', // Example URL
        'https://www.espncricinfo.com/story/india-vs-england-test-series-review-1426555'
    ];

    for (const url of urls) {
        console.log(`Testing URL: ${url}`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const html = await res.text();
                const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

                if (match && match[1]) {
                    console.log(`SUCCESS: Found image: ${match[1]}`);
                } else {
                    console.log('FAILURE: No og:image found.');
                    // console.log('HTML Snippet:', html.substring(0, 500));
                }
            } else {
                console.log(`FAILURE: HTTP ${res.status}`);
            }
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
        }
        console.log('---');
    }
}

testImageFetching();
