import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds cache

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check Cache
    if (cache.has(url)) {
        const cached = cache.get(url)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json({ ...cached.data, cached: true });
        }
    }

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            next: { revalidate: 30 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch page: ${res.status}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        interface Batsman {
            name: string;
            runs: string;
            balls: string;
            dismissal: string;
        }

        interface Bowler {
            name: string;
            overs: string;
            maidens: string;
            runs: string;
            wickets: string;
            economy: string;
        }

        const batsmen: Batsman[] = [];
        const bowlers: Bowler[] = [];

        // Extract Overs Logic
        const bodyText = $('body').text();
        let team1Overs = '';

        // Standard "Team • Score(Overs)" pattern
        const scoreMatches = bodyText.match(/([a-zA-Z\s]+)[\s•]*(\d+\/\d+|\d+)\s*\(([\d\.]+)\s*overs?\)/g);

        if (scoreMatches && scoreMatches.length > 0) {
            const lastMatch = scoreMatches[scoreMatches.length - 1];
            const m = lastMatch.match(/\(([\d\.]+)\s*overs?\)/);
            if (m) team1Overs = m[1] + ' ov';
        }

        // Fallback: Look for short "(20 ov)" style
        if (!team1Overs) {
            const shortOvMatches = bodyText.match(/\(([\d\.]+)\s*ov\)/g);
            if (shortOvMatches && shortOvMatches.length > 0) {
                // Usually the first one is the active one in the summary block
                team1Overs = shortOvMatches[0].replace('(', '').replace(')', '');
            }
        }

        $('table').each((_, table) => {
            const $table = $(table);
            const headers = $table.find('th').map((_, th) => $(th).text().trim()).get();
            const headerText = headers.join(' ');

            // Check if Batting Table
            if ((headerText.includes('R') && headerText.includes('B') && headerText.includes('4s')) || headerText.includes('Batting')) {
                $table.find('tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    if (tds.length >= 4) {
                        const cellTexts = tds.map((_, td) => $(td).text().trim()).get();
                        if (cellTexts.length > 2 && /^\d+$/.test(cellTexts[2]) && !cellTexts[0].includes('Extras')) {
                            batsmen.push({
                                name: cellTexts[0],
                                dismissal: cellTexts[1] || '',
                                runs: cellTexts[2] || '0',
                                balls: cellTexts[3] || '0'
                            });
                        }
                    }
                });
            }

            // Check if Bowling Table
            if (headerText.includes('O') && headerText.includes('M') && headerText.includes('R') && headerText.includes('W')) {
                $table.find('tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    if (tds.length >= 5) {
                        const cellTexts = tds.map((_, td) => $(td).text().trim()).get();
                        if (cellTexts.length > 4 && /^\d+(\.\d+)?$/.test(cellTexts[1])) {
                            bowlers.push({
                                name: cellTexts[0],
                                overs: cellTexts[1] || '',
                                maidens: cellTexts[2] || '',
                                runs: cellTexts[3] || '',
                                wickets: cellTexts[4] || '',
                                economy: cellTexts[5] || ''
                            });
                        }
                    }
                });
            }
        });

        const data = {
            title: $('title').text(),
            currentOvers: team1Overs,
            batsmen: batsmen.slice(0, 15),
            bowlers: bowlers.slice(0, 10)
        };

        cache.set(url, { data, timestamp: Date.now() });

        return NextResponse.json(data);

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
