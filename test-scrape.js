const cheerio = require('cheerio');

async function scrape() {
    try {
        const url = 'https://www.espncricinfo.com/series/west-indies-in-new-zealand-2025-26-1491681/new-zealand-vs-west-indies-1st-test-1491732/live-cricket-score';
        console.log('Fetching:', url);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = await res.text();
        const $ = cheerio.load(html);

        // Search for text that looks like "(X ov)" or "X.Y overs"
        const text = $('body').text();
        const oversMatch = text.match(/\(\d+\.?\d*\s*ov\)/g);
        console.log('Overs matches found in body:', oversMatch);

        // Try to find specific element with score
        // Look for divs containing "/" and "("
        $('div').each((i, el) => {
            const t = $(el).text().trim();
            if (t.includes('/') && t.includes('ov') && t.length < 50) {
                console.log('Potential Score Line:', t);
            }
        });

    } catch (e) {
        console.error(e);
    }
}

scrape();
