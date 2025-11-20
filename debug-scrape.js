const Parser = require('rss-parser');
const cheerio = require('cheerio');

const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

async function debugScrape() {
    try {
        console.log('Fetching RSS feed...');
        const feed = await parser.parseURL(RSS_URL);

        const calculatePriority = (item) => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const desc = (item.content || item.contentSnippet || '').toLowerCase();
            if (title.includes('*') || desc.includes('*') || desc.includes('live')) score += 100;
            return score;
        };

        const sortedMatches = feed.items.map(item => ({
            item,
            priority: calculatePriority(item)
        })).sort((a, b) => b.priority - a.priority);

        const match = sortedMatches[0].item;
        console.log('\nSelected Match:', match.title);
        console.log('Link:', match.link);

        if (!match.link) {
            console.log('No link found.');
            return;
        }

        console.log('\nFetching match page...');
        const res = await fetch(match.link, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        console.log('\n=== DEBUGGING DETAILED SCORE SCRAPING ===\n');

        // Test table scraping
        console.log('--- All Tables ---');
        $('table').each((tableIdx, table) => {
            const headers = $(table).find('thead th, thead td').map((i, th) => $(th).text().trim()).get();
            console.log(`Table ${tableIdx} Headers:`, headers);

            // Check if it's a batting or bowling table
            const isBatting = headers.some(h => h.toLowerCase().includes('batter') || h.toLowerCase().includes('batting'));
            const isBowling = headers.some(h => h.toLowerCase().includes('bowler') || h.toLowerCase().includes('bowling'));

            if (isBatting) {
                console.log('>>> BATTING TABLE FOUND');
                $(table).find('tbody tr').slice(0, 3).each((i, row) => {
                    const tds = $(row).find('td');
                    console.log(`  Row ${i} (${tds.length} cols):`, tds.map((j, td) => $(td).text().trim()).get());
                });
            }

            if (isBowling) {
                console.log('>>> BOWLING TABLE FOUND');
                $(table).find('tbody tr').slice(0, 3).each((i, row) => {
                    const tds = $(row).find('td');
                    console.log(`  Row ${i} (${tds.length} cols):`, tds.map((j, td) => $(td).text().trim()).get());
                });
            }
        });

        // Test partnership
        console.log('\n--- Partnership Info ---');
        const partnership = $('*:contains("Partnership")').first();
        if (partnership.length > 0) {
            console.log('Found "Partnership" text:', partnership.text().trim().substring(0, 100));
            console.log('Parent:', partnership.parent().text().trim().substring(0, 100));
        } else {
            console.log('No "Partnership" text found');
        }

        // Test recent balls
        console.log('\n--- Recent Balls ---');
        $('.match-commentary__run').each((i, el) => {
            if (i < 6) console.log(`Ball ${i}:`, $(el).text().trim());
        });

        // Alternative selector for recent balls
        const recentBalls = $('[class*="ball"], [class*="run"], [class*="commentary"]').slice(0, 10);
        console.log('Alternative ball elements found:', recentBalls.length);

    } catch (error) {
        console.error('Error:', error);
    }
}

debugScrape();
