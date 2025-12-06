import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('http://static.cricinfo.com/rss/livescores.xml');

        const matches = feed.items.map((item, index) => {
            // Parse title to extract teams and scores
            // Example: "Australia v England 325/9 *"
            const title = item.title || '';
            const isLive = title.includes('*');

            return {
                id: item.guid || index.toString(),
                title: title,
                link: item.link,
                live: isLive,
                description: item.description
            };
        });

        // Priority Logic for Trending
        const prioritize = (match: any): number => {
            const title = match.title.toLowerCase();
            let score = 0;
            // High priority teams
            if (title.includes('india') || title.includes('ind')) score += 10;
            if (title.includes('australia') || title.includes('aus')) score += 8;
            if (title.includes('england') || title.includes('eng')) score += 8;
            if (title.includes('pakistan') || title.includes('pak')) score += 7;
            if (title.includes('final')) score += 20; // Finals are always trending
            if (title.includes('cup')) score += 5;
            return score;
        };

        const liveMatches = matches.filter((m: any) => m.live).sort((a: any, b: any) => prioritize(b) - prioritize(a));
        const recentMatches = matches.filter((m: any) => !m.live);

        // NOTE: RSS feed does not provide valid upcoming matches. 
        // Returning empty array to avoid displaying incorrect mock data.
        const upcomingMatches: any[] = [];

        return NextResponse.json({
            matches, // For backward compatibility
            dashboard: {
                // Trending is the highest priority live match, or the first recent match if no live
                trending: liveMatches.length > 0 ? liveMatches[0] : (recentMatches.length > 0 ? recentMatches[0] : null),
                live: liveMatches.length > 1 ? liveMatches.slice(1) : [],
                recent: recentMatches,
                upcoming: upcomingMatches
            }
        });
    } catch (error) {
        console.error('Error fetching live scores:', error);
        return NextResponse.json({ matches: [] }, { status: 500 });
    }
}
