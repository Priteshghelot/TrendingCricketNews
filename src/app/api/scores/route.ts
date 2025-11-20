import { NextResponse } from 'next/server';
import { getScore, updateScore, Score, Batsman, Bowler } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

export async function GET() {
    try {
        const feed = await parser.parseURL(RSS_URL);

        const calculatePriority = (item: any) => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const desc = (item.content || item.contentSnippet || '').toLowerCase();

            if (title.includes('*') || desc.includes('*') || desc.includes('live')) score += 100;
            if (title.includes('world cup') || title.includes('t20 world cup')) score += 50;
            if (title.includes('test') || title.includes('odi') || title.includes('t20i')) score += 20;
            const majorTeams = ['india', 'australia', 'england', 'pakistan', 'south africa'];
            if (majorTeams.some(t => title.includes(t))) score += 10;
            if (title.includes('ipl') || title.includes('bbl') || title.includes('psl')) score += 15;
            if (title.includes('women')) score += 5;
            if (desc.includes('won by') || desc.includes('match ended')) score -= 50;

            return score;
        };

        const sortedMatches = feed.items.map(item => ({
            item,
            priority: calculatePriority(item)
        })).sort((a, b) => b.priority - a.priority);

        let match = sortedMatches.length > 0 ? sortedMatches[0].item : feed.items[0];
        const title = match.title || '';
        const description = match.content || match.contentSnippet || '';

        const parts = title.split(/\s+v\s+|\s+vs\s+/i);
        let teamA = parts[0]?.trim() || 'Team A';
        let teamB = parts[1]?.trim() || 'Team B';
        let scoreA = 'Yet to Bat';
        let scoreB = 'Yet to Bat';

        const scoreMatchA = teamA.match(/(\D+)\s+(\d+\/?\d*.*)/);
        if (scoreMatchA) {
            teamA = scoreMatchA[1].trim();
            scoreA = scoreMatchA[2].trim();
        }
        const scoreMatchB = teamB.match(/(\D+)\s+(\d+\/?\d*.*)/);
        if (scoreMatchB) {
            teamB = scoreMatchB[1].trim();
            scoreB = scoreMatchB[2].trim();
        }

        let detailedScore = {
            batters: [] as Batsman[],
            bowlers: [] as Bowler[],
            partnership: '0 (0)',
            recentBalls: [] as string[],
            matchInfo: match.title || '',
            scrapedScores: [] as string[],
            seriesName: '',
            matchLocation: '',
            equation: ''
        };

        if (match.link) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const res = await fetch(match.link, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const html = await res.text();
                    const $ = cheerio.load(html);

                    // Find ALL tables and analyze them
                    console.log('=== ANALYZING TABLES ===');
                    $('table').each((tableIdx, table) => {
                        const headers = $(table).find('thead th, thead td').map((i, th) => $(th).text().trim()).get();
                        console.log(`Table ${tableIdx} headers:`, headers);

                        // Check if this is a batting table
                        if (headers.some(h => h.toLowerCase() === 'batter' || h.toLowerCase() === 'batting')) {
                            console.log('Found batting table at index', tableIdx);

                            $(table).find('tbody tr').slice(0, 3).each((rowIdx, row) => {
                                const cells = $(row).find('td').map((i, td) => $(td).text().trim()).get();
                                console.log(`  Row ${rowIdx}:`, cells);
                            });

                            // Scrape batters with correct indices
                            $(table).find('tbody tr').each((i, row) => {
                                const tds = $(row).find('td');
                                if (tds.length >= 7) {
                                    const name = $(tds[0]).text().trim();
                                    const dismissal = $(tds[1]).text().trim();
                                    const runs = $(tds[2]).text().trim();
                                    const balls = $(tds[3]).text().trim();
                                    const fours = $(tds[5]).text().trim();
                                    const sixes = $(tds[6]).text().trim();
                                    const sr = $(tds[7]).text().trim();

                                    if (name && !name.includes('Extras') && !name.includes('Total') && !name.includes('Did not bat') && !isNaN(Number(runs))) {
                                        detailedScore.batters.push({ name, runs, balls, fours, sixes, sr });
                                    }
                                }
                            });
                        }

                        // Check if this is a bowling table
                        if (headers.some(h => h.toLowerCase() === 'bowler' || h.toLowerCase() === 'bowling')) {
                            console.log('Found bowling table at index', tableIdx);

                            $(table).find('tbody tr').slice(0, 3).each((rowIdx, row) => {
                                const cells = $(row).find('td').map((i, td) => $(td).text().trim()).get();
                                console.log(`  Row ${rowIdx}:`, cells);
                            });

                            // Scrape bowlers
                            $(table).find('tbody tr').each((i, row) => {
                                const tds = $(row).find('td');
                                if (tds.length >= 6) {
                                    const name = $(tds[0]).text().trim();
                                    const overs = $(tds[1]).text().trim();

                                    if (name && (overs.includes('.') || !isNaN(Number(overs))) && name !== 'Total') {
                                        detailedScore.bowlers.push({
                                            name,
                                            overs,
                                            maidens: $(tds[2]).text().trim(),
                                            runs: $(tds[3]).text().trim(),
                                            wickets: $(tds[4]).text().trim(),
                                            economy: $(tds[5]).text().trim(),
                                            extras: $(tds[7])?.text().trim() || '0'
                                        });
                                    }
                                }
                            });
                        }
                    });

                    // Limit to active players
                    if (detailedScore.batters.length > 2) {
                        detailedScore.batters = detailedScore.batters.slice(-2);
                    }
                    if (detailedScore.bowlers.length > 0) {
                        detailedScore.bowlers = detailedScore.bowlers.slice(-2);
                    }

                    // Scrape match details
                    const seriesName = $('.ds-text-tight-m.ds-font-regular.ds-uppercase.ds-text-typo-mid3').first().text().trim();
                    const matchLocation = $('.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3').first().text().trim();
                    const equation = $('.ds-text-tight-s.ds-font-medium.ds-truncate.ds-text-typo').text().trim();

                    detailedScore.seriesName = seriesName;
                    detailedScore.matchLocation = matchLocation;
                    detailedScore.equation = equation;
                    if (seriesName) detailedScore.matchInfo = seriesName;

                    // Scrape recent balls
                    $('.match-commentary__run').each((i, el) => {
                        if (i < 6) {
                            const run = $(el).text().trim();
                            if (run) detailedScore.recentBalls.push(run);
                        }
                    });
                }
            } catch (e) {
                console.warn('Scraping failed:', e);
            }
        }

        const currentBatters = detailedScore.batters.map(b => b.name);
        const currentBowlers = detailedScore.bowlers.map(b => b.name);

        const autoScore: Score = {
            teamA,
            teamB,
            scoreA: scoreA || 'Yet to Bat',
            scoreB: scoreB || 'Yet to Bat',
            status: description,
            matchTitle: match.title || 'Live Match',
            seriesName: detailedScore.seriesName || '',
            matchLocation: detailedScore.matchLocation || '',
            equation: detailedScore.equation || description,
            commentary: await scrapeRealCommentary(match.link || '', currentBatters, currentBowlers),
            detailedScore
        };

        return NextResponse.json(autoScore);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
    }
}

async function scrapeRealCommentary(matchUrl: string, batters: string[], bowlers: string[]) {
    if (!matchUrl) return generateSimulatedCommentary(batters, bowlers);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(matchUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        clearTimeout(timeoutId);

        if (!res.ok) return generateSimulatedCommentary(batters, bowlers);

        const html = await res.text();
        const $ = cheerio.load(html);
        const commentary: { ball: string; text: string; run: string }[] = [];

        console.log('=== SCRAPING COMMENTARY ===');

        // Strategy 1: Look for commentary items with specific ESPN classes
        $('div[class*="Commentry"]').each((i, el) => {
            if (i < 10) {
                const ballText = $(el).find('strong').first().text().trim();
                const fullText = $(el).text().trim();
                const runValue = $(el).find('span[class*="run"]').text().trim() ||
                    $(el).find('.ds-w-8').text().trim() || '0';

                console.log(`Commentary ${i}:`, { ballText, fullText: fullText.substring(0, 100), runValue });

                if (ballText && fullText) {
                    commentary.push({
                        ball: ballText,
                        text: fullText.replace(ballText, '').trim(),
                        run: runValue
                    });
                }
            }
        });

        // Strategy 2: Try data-testid approach
        if (commentary.length === 0) {
            $('[data-testid*="commentary"]').each((i, el) => {
                if (i < 10) {
                    const ballText = $(el).find('strong, b, .ds-font-bold').first().text().trim();
                    const fullText = $(el).text().trim();
                    const runValue = $(el).find('.ds-w-8, span[class*="run"]').text().trim() || '0';

                    if (ballText && fullText) {
                        commentary.push({
                            ball: ballText,
                            text: fullText.replace(ballText, '').trim(),
                            run: runValue
                        });
                    }
                }
            });
        }

        // Strategy 3: Look for any divs with ball notation pattern (e.g., "6.3", "12.5")
        if (commentary.length === 0) {
            $('div').each((i, el) => {
                const text = $(el).text().trim();
                const ballMatch = text.match(/^(\d+\.\d+)/); // Matches "6.3", "12.5", etc.

                if (ballMatch && commentary.length < 10) {
                    const ball = ballMatch[1];
                    const restOfText = text.substring(ball.length).trim();

                    // Extract run value if present
                    const runMatch = restOfText.match(/(no run|FOUR|SIX|WICKET|W|\d+ runs?)/i);
                    const run = runMatch ? runMatch[0] : '0';

                    if (restOfText.length > 10) { // Ensure there's actual commentary
                        commentary.push({ ball, text: restOfText, run });
                    }
                }
            });
        }

        console.log(`Found ${commentary.length} commentary items`);

        if (commentary.length > 0) {
            return commentary.slice(0, 10); // Return max 10 items
        }

        return generateSimulatedCommentary(batters, bowlers);
    } catch (e) {
        console.warn('Commentary scraping failed:', e);
        return generateSimulatedCommentary(batters, bowlers);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        return NextResponse.json({ success: true, score: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

function generateSimulatedCommentary(batters: string[], bowlers: string[]) {
    // Generate dynamic over number based on current time to simulate progression
    const currentMinute = new Date().getMinutes();
    const baseOver = Math.floor(currentMinute / 3); // Changes every 3 minutes

    const outcomes = ['1 run', 'No run', 'FOUR', 'SIX', 'WICKET', '2 runs'];
    const bowler = bowlers[0] || 'Bowler';
    const batter = batters[0] || 'Batter';
    const commentary = [];

    for (let i = 0; i < 6; i++) {
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        commentary.push({
            ball: `${baseOver}.${i + 1}`,  // Dynamic over number
            text: `${bowler} to ${batter}, ${outcome.toLowerCase()}`,
            run: outcome
        });
    }

    return commentary.reverse();
}
