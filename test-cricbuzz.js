const Parser = require('rss-parser');
const parser = new Parser();
const RSS_URL = 'https://www.cricbuzz.com/rss/livescores.xml'; // Guessing URL

(async () => {
    try {
        console.log('Fetching Cricbuzz RSS...');
        const feed = await parser.parseURL('http://synd.cricbuzz.com/j2me/1.0/livematches.xml'); // Known old feed
        console.log(`Success! Found ${feed.items.length} items.`);
        if (feed.items.length > 0) {
            console.log(feed.items[0]);
        }
    } catch (error) {
        console.error('Error fetching Cricbuzz RSS:', error);

        // Try another one
        try {
            const feed2 = await parser.parseURL('https://www.cricbuzz.com/api/rss/livescores.xml');
            console.log('Success 2!', feed2.items.length);
        } catch (e) {
            console.log('Error 2 failed');
        }
    }
})();
