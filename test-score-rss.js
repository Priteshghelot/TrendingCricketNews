const Parser = require('rss-parser');
const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

(async () => {
    try {
        console.log('Fetching Live Scores RSS...');
        const feed = await parser.parseURL(RSS_URL);
        console.log(`Success! Found ${feed.items.length} items.`);
        if (feed.items.length > 0) {
            console.log('First item title:', feed.items[0].title);
            console.log('First item link:', feed.items[0].link);
            console.log('First item content:', feed.items[0].content);
        }
    } catch (error) {
        console.error('Error fetching RSS:', error);
    }
})();
