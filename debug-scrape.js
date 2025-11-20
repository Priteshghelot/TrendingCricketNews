const Parser = require('rss-parser');
const cheerio = require('cheerio');

const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

async function debugScrape() {
    try {
        console.log('Fetching RSS feed...');
        const feed = await parser.parseURL(RSS_URL);

        // Log all titles to see what's available
        console.log('Available Matches:');
        feed.items.forEach((item, i) => console.log(`${i}: ${item.title}`));

        // Use the same priority logic as the app
        const calculatePriority = (item) => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const desc = (item.content || item.contentSnippet || '').toLowerCase();
            if (title.includes('*') || desc.includes('*') || desc.includes('live')) score += 100;
            if (title.includes('women')) score += 5;
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

        console.log('Fetching match page...');
        const res = await fetch(match.link, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        // Test Selectors
        console.log('\n--- Testing Selectors ---');

        // Batters
        const batters = [];
        $('table.ci-scorecard-table tbody tr').each((i, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 6) {
                const name = $(tds[0]).text().trim();
                if (name && !name.includes('Extras') && !name.includes('Total')) {
                    batters.push(name);
                }
            }
        });
        console.log('Batters (ci-scorecard-table):', batters);

        // Try alternative selector for batters (ds-table)
        const battersAlt = [];
        $('table.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody tr').each((i, el) => {
            const tds = $(el).find('td');
            const name = $(tds[0]).text().trim();
            if (name) battersAlt.push(name);
        });
        console.log('Batters (ds-table):', battersAlt);

        // Header Scores
        const headerScores = [];
        $('.ds-text-compact-m, .ds-text-ui-typo-mid').each((i, el) => {
            headerScores.push($(el).text().trim());
        });
        console.log('Header Scores:', headerScores);

        // Series Name
        const seriesName = $('.ds-text-tight-m.ds-font-regular.ds-uppercase.ds-text-typo-mid3').first().text().trim();
        console.log('Series Name:', seriesName);

    } catch (error) {
        console.error('Error:', error);
    }
}

debugScrape();
