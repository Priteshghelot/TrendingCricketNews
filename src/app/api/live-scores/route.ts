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

        return NextResponse.json({ matches });
    } catch (error) {
        console.error('Error fetching live scores:', error);
        return NextResponse.json({ matches: [] }, { status: 500 });
    }
}
