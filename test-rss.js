const Parser = require('rss-parser');
const parser = new Parser();
const RSS_URL = 'https://feeds.feedburner.com/ndtvnews-top-stories';

(async () => {
    try {
        console.log('Fetching RSS...');
        const feed = await parser.parseURL(RSS_URL);
        console.log(`Success! Found ${feed.items.length} items.`);
        if (feed.items.length > 0) {
            console.log('First item:', feed.items[0].title);
        }
    } catch (error) {
        console.error('Error fetching RSS:', error);
    }
})();
