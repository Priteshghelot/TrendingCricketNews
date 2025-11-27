const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, 'data', 'posts.json');

try {
    const rawData = fs.readFileSync(postsPath, 'utf8');
    const posts = JSON.parse(rawData);

    console.log(`Total posts before cleanup: ${posts.length}`);

    const uniquePosts = [];
    const seenTitles = new Set();
    const seenUrls = new Set();

    // Helper for fuzzy matching
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    posts.forEach(post => {
        const normalizedTitle = normalize(post.content);

        // Check exact URL match
        if (seenUrls.has(post.sourceUrl)) {
            console.log(`Removing duplicate URL: ${post.content}`);
            return;
        }

        // Check fuzzy title match
        let isDuplicate = false;
        for (const seenTitle of seenTitles) {
            // Exact match
            if (seenTitle === normalizedTitle) {
                isDuplicate = true;
                break;
            }

            // Word similarity check
            const words1 = new Set(normalizedTitle.split(/\s+/));
            const words2 = new Set(seenTitle.split(/\s+/));
            const intersection = new Set([...words1].filter(x => words2.has(x)));
            const union = new Set([...words1, ...words2]);

            if ((intersection.size / union.size) > 0.7) {
                isDuplicate = true;
                console.log(`Removing fuzzy duplicate: "${post.content}" (matches "${seenTitle}")`);
                break;
            }
        }

        if (!isDuplicate) {
            uniquePosts.push(post);
            seenTitles.add(normalizedTitle);
            seenUrls.add(post.sourceUrl);
        }
    });

    console.log(`Total posts after cleanup: ${uniquePosts.length}`);
    console.log(`Removed ${posts.length - uniquePosts.length} duplicates.`);

    fs.writeFileSync(postsPath, JSON.stringify(uniquePosts, null, 2));
    console.log('Successfully saved cleaned posts.');

} catch (error) {
    console.error('Error cleaning posts:', error);
}
