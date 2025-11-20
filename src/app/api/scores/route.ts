import { NextResponse } from 'next/server';
import { Score, Batsman, Bowler, MatchPreview } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser();
const RSS_URL = 'https://static.cricinfo.com/rss/livescores.xml';

// Simple in-memory cache
let cache: {
    data: Score | null;
    timestamp: number;
} = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestedId = searchParams.get('id');

        // Check cache (skip if specific ID requested to ensure fresh data for switch)
        if (!requestedId && cache.data && (Date.now() - cache.timestamp < CACHE_DURATION)) {
            return NextResponse.json(cache.data);
        }

        const feed = await parser.parseURL(RSS_URL);

        const calculatePriority = (item: any) => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const desc = (item.content || item.contentSnippet || '').toLowerCase();
            const guid = item.guid || item.link || title;

            // 1. User Selection Override (Highest Priority)
            if (requestedId && (guid === requestedId || item.link === requestedId)) {
                return 10000;
            }

            // 2. Live Status
            if (title.includes('*') || desc.includes('*') || desc.includes('live')) score += 500;

            // 3. Team Popularity (India is top priority for this user)
            if (title.includes('india')) score += 200;
            const majorTeams = ['australia', 'england', 'pakistan', 'south africa', 'new zealand'];
            if (majorTeams.some(t => title.includes(t))) score += 50;

            // 4. Tournament/Series Importance
            if (title.includes('world cup')) score += 100;
            if (title.includes('final')) score += 75;
            if (title.includes('semi-final')) score += 60;
            if (title.includes('ipl') || title.includes('bbl') || title.includes('psl')) score += 40;

            // 5. Format Preference
            if (title.includes('t20')) score += 30;
            if (title.includes('odi')) score += 20;
            if (title.includes('test')) score += 10;

            // 6. Negative Weights (Finished matches)
            if (desc.includes('won by') || desc.includes('match ended')) score -= 1000;

            return score;
        };

        const sortedMatches = feed.items.map(item => ({
            item,
            priority: calculatePriority(item)
        })).sort((a, b) => b.priority - a.priority);

        // 1. Process Live Match (Top Priority)
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


                    $('table').each((tableIdx, table) => {
                        const headers = $(table).find('thead th, thead td').map((i, th) => $(th).text().trim()).get();

                        // Check if this is the combined batting/bowling table
                        const hasBatters = headers.some(h => h.toLowerCase() === 'batters');
                        const hasBowlers = headers.some(h => h.toLowerCase() === 'bowlers');

                        if (hasBatters && hasBowlers) {
                            // This is the combined table - batters and bowlers are in the same table
                            $(table).find('tbody tr').each((i, row) => {
                                const tds = $(row).find('td');

                                // Batters have 8 columns, bowlers have 10 columns
                                if (tds.length === 8) {
                                    // This is a batter row
                                    const name = $(tds[0]).text().trim();
                                    const runs = $(tds[1]).text().trim();
                                    const balls = $(tds[2]).text().trim();
                                    const fours = $(tds[3]).text().trim();
                                    const sixes = $(tds[4]).text().trim();
                                    const sr = $(tds[5]).text().trim();

                                    if (name && !name.includes('Extras') && !name.includes('Total') && !isNaN(Number(runs))) {
                                        detailedScore.batters.push({ name, runs, balls, fours, sixes, sr });
                                    }
                                } else if (tds.length >= 10) {
                                    // This is a bowler row
                                    const name = $(tds[0]).text().trim();
                                    const overs = $(tds[1]).text().trim();
                                    const maidens = $(tds[2]).text().trim();
                                    const runs = $(tds[3]).text().trim();
                                    const wickets = $(tds[4]).text().trim();
                                    const economy = $(tds[5]).text().trim();

                                    if (name && (overs.includes('.') || !isNaN(Number(overs))) && name !== 'Total') {
                                        detailedScore.bowlers.push({
                                            name,
                                            overs,
                                            maidens,
                                            runs,
                                            wickets,
                                            economy
                                        });
                                    }
                                }
                            });
                        } else {
                            // Fallback: separate batting/bowling tables
                            if (headers.some(h => h.toLowerCase().includes('batter') || h.toLowerCase().includes('batting'))) {
                                $(table).find('tbody tr').each((i, row) => {
                                    const tds = $(row).find('td');
                                    if (tds.length >= 6) {
                                        const name = $(tds[0]).text().trim();
                                        const runs = $(tds[1] || tds[2]).text().trim();
                                        const balls = $(tds[2] || tds[3]).text().trim();
                                        const fours = $(tds[3] || tds[4]).text().trim();
                                        const sixes = $(tds[4] || tds[5]).text().trim();
                                        const sr = $(tds[5] || tds[6]).text().trim();

                                        if (name && !name.includes('Extras') && !name.includes('Total') && !isNaN(Number(runs))) {
                                            detailedScore.batters.push({ name, runs, balls, fours, sixes, sr });
                                        }
                                    }
                                });
                            }

                            if (headers.some(h => h.toLowerCase().includes('bowler') || h.toLowerCase().includes('bowling'))) {
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
                                                economy: $(tds[5]).text().trim()
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });



                    // Keep only current batters (last 2) and current bowlers (last 2)
                    if (detailedScore.batters.length > 2) detailedScore.batters = detailedScore.batters.slice(-2);
                    if (detailedScore.bowlers.length > 2) detailedScore.bowlers = detailedScore.bowlers.slice(-2);

                    const seriesName = $('.ds-text-tight-m.ds-font-regular.ds-uppercase.ds-text-typo-mid3').first().text().trim();
                    const matchLocation = $('.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3').first().text().trim();
                    const equation = $('.ds-text-tight-s.ds-font-medium.ds-truncate.ds-text-typo').text().trim();

                    detailedScore.seriesName = seriesName;
                    detailedScore.matchLocation = matchLocation;
                    detailedScore.equation = equation;
                    if (seriesName) detailedScore.matchInfo = seriesName;

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

        // 2. Process Upcoming Matches
        const upcomingMatches: MatchPreview[] = feed.items.slice(0, 15).map(item => {
            const title = item.title || '';
            const description = item.contentSnippet || item.content || '';

            const isLive = title.includes('*') ||
                description.toLowerCase().includes('live') ||
                description.toLowerCase().includes('innings') ||
                description.toLowerCase().includes('overs');

            const cleanTitle = title.replace(/\*/g, '').trim();

            let status = description;
            if (description.toLowerCase().includes('scheduled') ||
                description.toLowerCase().includes('start') ||
                description.toLowerCase().includes('today') ||
                description.toLowerCase().includes('tomorrow')) {
                status = description;
            } else if (isLive) {
                status = '🔴 Live Now';
            } else if (description.length > 100) {
                status = description.substring(0, 100) + '...';
            }

            return {
                title: cleanTitle,
                status: status,
                isLive: isLive,
                id: item.guid || item.link || title
            };
        }).filter(match => match.title.length > 0);


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
            detailedScore,
            upcomingMatches
        };

        // Update cache
        cache = {
            data: autoScore,
            timestamp: Date.now()
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

        // Strategy 1: Look for commentary items with specific ESPN classes
        $('div[class*="Commentry"]').each((i, el) => {
            if (i < 10) {
                const ballText = $(el).find('strong').first().text().trim();
                const fullText = $(el).text().trim();
                const runValue = $(el).find('span[class*="run"]').text().trim() ||
                    $(el).find('.ds-w-8').text().trim() || '0';

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

        // Strategy 3: Look for any divs with ball notation pattern
        if (commentary.length === 0) {
            $('div').each((i, el) => {
                const text = $(el).text().trim();
                const ballMatch = text.match(/^(\d+\.\d+)/);

                if (ballMatch && commentary.length < 10) {
                    const ball = ballMatch[1];
                    const restOfText = text.substring(ball.length).trim();
                    const runMatch = restOfText.match(/(no run|FOUR|SIX|WICKET|W|\d+ runs?)/i);
                    const run = runMatch ? runMatch[0] : '0';

                    if (restOfText.length > 10) {
                        commentary.push({ ball, text: restOfText, run });
                    }
                }
            });
        }

        if (commentary.length > 0) {
            return commentary.slice(0, 10);
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
    const currentMinute = new Date().getMinutes();
    const baseOver = Math.floor(currentMinute / 3);

    const outcomes = ['1 run', 'No run', 'FOUR', 'SIX', 'WICKET', '2 runs'];
    const bowler = bowlers[0] || 'Bowler';
    const batter = batters[0] || 'Batter';
    const commentary = [];

    for (let i = 0; i < 6; i++) {
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        commentary.push({
            ball: `${baseOver}.${i + 1}`,
            text: `${bowler} to ${batter}, ${outcome.toLowerCase()}`,
            run: outcome
        });
    }

    return commentary.reverse();
}
