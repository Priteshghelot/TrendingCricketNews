import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
    try {
        // 1. Fetch Live/Recent from RSS (Fast & Reliable)
        const parser = new Parser();
        const feed = await parser.parseURL('http://static.cricinfo.com/rss/livescores.xml');

        const matches = feed.items.map((item, index) => {
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

        // Priority Logic
        const prioritize = (match: any): number => {
            const title = match.title.toLowerCase();
            let score = 0;
            if (title.includes('india') || title.includes('ind')) score += 10;
            if (title.includes('australia') || title.includes('aus')) score += 8;
            if (title.includes('england') || title.includes('eng')) score += 8;
            if (title.includes('final')) score += 20;
            return score;
        };

        const liveMatches = matches.filter((m: any) => m.live).sort((a: any, b: any) => prioritize(b) - prioritize(a));
        const recentMatches = matches.filter((m: any) => !m.live);

        // 2. Fetch Upcoming from Cricbuzz (Scraping)
        let upcomingMatches: any[] = [];
        try {
            const res = await fetch('https://www.cricbuzz.com/cricket-match/live-scores/upcoming-matches', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (res.ok) {
                const html = await res.text();
                const $ = cheerio.load(html);

                // Cricbuzz structure: .cb-mtch-lst
                $('.cb-mtch-lst').each((i, el) => {
                    if (i > 4) return; // Limit to 5 upcoming
                    const title = $(el).find('.cb-lv-scr-mtch-hdr a').text().trim();
                    const status = $(el).find('.cb-text-preview').text().trim() || 'Upcoming';
                    if (title) {
                        upcomingMatches.push({
                            id: 'up-' + i,
                            title: title,
                            status: status,
                            live: false,
                            description: 'Starts soon'
                        });
                    }
                });
            }
        } catch (err) {
            console.error('Failed to scrape upcoming:', err);
            // Fallback: Add one placeholder if vital
            upcomingMatches.push({ id: 'mock-1', title: 'India vs TBD (Upcoming Series)', status: 'Check Schedule', live: false });
        }

        return NextResponse.json({
            matches,
            dashboard: {
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
