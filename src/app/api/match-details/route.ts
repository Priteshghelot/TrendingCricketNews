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
        // Fetch the page
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            next: { revalidate: 30 } // Next.js fetch cache
        });

        // ... (HTML parsing logic continues below) ...


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
            maidens: string; // usually O M R W
            runs: string;
            wickets: string;
            economy: string;
        }

        const batsmen: Batsman[] = [];
        const bowlers: Bowler[] = [];

        // Parsing Strategy:
        // Find tables. Identify by header content.

        $('table').each((_, table) => {
            const $table = $(table);
            const headers = $table.find('th').map((_, th) => $(th).text().trim()).get();
            const headerText = headers.join(' ');

            // Check if Batting Table (Usually contains 'R' 'B' '4s' '6s' or 'Runs' 'Balls')
            // Headers often: "BATTING", "R", "B", "M", "4s", "6s", "SR"
            if ((headerText.includes('R') && headerText.includes('B') && headerText.includes('4s')) || headerText.includes('Batting')) {
                // Iterate rows
                $table.find('tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    // Typical row: Name, Dismissal, R, B, M, 4s, 6s, SR
                    // But layout varies. We need to be careful.
                    // Usually Name is first td (or inside a div in first td)

                    if (tds.length >= 4) {
                        const name = $(tds[0]).text().trim();
                        // Dismissal is often 2nd col, or part of name col in mobile view. 
                        // In desktop view (which we spoofed), it's often 2nd col.
                        // Let's assume desktop columns: Name, Dismissal, R, B...

                        // Valid row check: name shouldn't be "Extras" or "Total"
                        if (name && !name.includes('Extras') && !name.includes('Total') && !name.includes('Did not bat')) {
                            // Attempt to map columns based on known header index? 
                            // Hard to do dynamically. Heuristic:
                            // Runs is usually the first BOLD number or the column with 'R' header

                            // Let's try to extract standard indices for desktop:
                            // 0: Name, 1: Dismissal, 2: R, 3: B (Example)

                            // We will just take the text values and try to make sense
                            const cellTexts = tds.map((_, td) => $(td).text().trim()).get();

                            // Check if it's a valid player row (has numbers)
                            if (cellTexts.some(t => /^\d+$/.test(t))) {
                                // Simple mapping for now
                                batsmen.push({
                                    name: cellTexts[0],
                                    dismissal: cellTexts[1] || '',
                                    runs: cellTexts[2] || '0',
                                    balls: cellTexts[3] || '0'
                                });
                            }
                        }
                    }
                });
            }

            // Check if Bowling Table (Includes 'O', 'M', 'R', 'W')
            if (headerText.includes('O') && headerText.includes('M') && headerText.includes('R') && headerText.includes('W')) {
                $table.find('tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    if (tds.length >= 5) {
                        const name = $(tds[0]).text().trim();
                        if (name) {
                            const cellTexts = tds.map((_, td) => $(td).text().trim()).get();
                            // 0: Name, 1: O, 2: M, 3: R, 4: W, 5: Econ
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

        // Clean up duplicates (sometimes multiple innings tables)
        // We will just take the first 11 batsmen and reasonable bowlers or just return all

        const data = {
            title: $('title').text(),
            batsmen: batsmen.slice(0, 15),
            bowlers: bowlers.slice(0, 10)
        };

        // Update Cache
        cache.set(url, { data, timestamp: Date.now() });

        return NextResponse.json(data);

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
