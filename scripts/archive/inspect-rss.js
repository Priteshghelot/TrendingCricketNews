const Parser = require('rss-parser');
const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

(async () => {
    try {
        console.log('Fetching Live Scores RSS...');
        const feed = await parser.parseURL(RSS_URL);
        console.log(`Success! Found ${feed.items.length} items.`);
        feed.items.forEach((item, index) => {
            console.log(`[${index}] ${item.title}`);
        });
    } catch (error) {
        console.error('Error fetching RSS:', error);
    }
})();
