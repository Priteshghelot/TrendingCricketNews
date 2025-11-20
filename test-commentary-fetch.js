const Parser = require('rss-parser');
const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

(async () => {
    try {
        const feed = await parser.parseURL(RSS_URL);
        if (feed.items.length > 0) {
            const match = feed.items[0];
            console.log('Match URL:', match.link);

            if (match.link) {
                const res = await fetch(match.link);
                const html = await res.text();
                console.log('HTML Length:', html.length);

                // Naive check for commentary keywords
                if (html.includes('commentary-item')) {
                    console.log('Found "commentary-item" class!');
                } else if (html.includes('description')) {
                    console.log('Found "description" tag.');
                }

                // Dump a small chunk to see structure
                // console.log(html.substring(0, 2000)); 
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();
