import { NextResponse } from 'next/server';
import { getPosts, addPost, updatePostStatus, Post } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

const parser = new Parser();

// Multiple RSS feeds for broader coverage from diverse sources
const RSS_FEEDS = [
    // International Cricket News
    'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', // ESPN Cricinfo
    'http://newsrss.bbc.co.uk/rss/sportonline_uk_edition/cricket/rss.xml', // BBC Sport Cricket
    'https://www.skysports.com/rss/12040', // Sky Sports Cricket

    // Additional Cricket Sources
    'https://cricketaddictor.com/feed/', // Cricket Addictor
    'https://www.crictracker.com/feed/', // CricTracker
    'https://www.cricket.com.au/feed', // Cricket Australia
    'https://www.icc-cricket.com/rss/news', // ICC Official

    // Regional Cricket News
    'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms', // Times of India Cricket
    'https://www.hindustantimes.com/feeds/rss/cricket/rssfeed.xml', // Hindustan Times Cricket

    // Twitter/X via Nitter (Alternative Twitter Frontend with RSS)
    'https://nitter.net/ICC/rss', // ICC Official Twitter
    'https://nitter.net/ESPNcricinfo/rss', // ESPN Cricinfo Twitter
    'https://nitter.net/cricketcomau/rss', // Cricket Australia Twitter
    'https://nitter.net/BCCI/rss', // BCCI Official Twitter
    'https://nitter.net/englandcricket/rss', // England Cricket Twitter
];

// Cricket-related keywords for filtering
const CRICKET_KEYWORDS = [
    'cricket', 'wicket', 'batsman', 'batter', 'bowler', 'innings', 'test match',
    'odi', 't20', 'ipl', 'bbl', 'psl', 'cpl', 'hundred', 'ashes', 'world cup',
    'run', 'over', 'maiden', 'boundary', 'six', 'four', 'stumps', 'catch',
    'lbw', 'run out', 'century', 'half-century', 'duck', 'hat-trick',
    'spinner', 'pacer', 'all-rounder', 'captain', 'umpire', 'drs', 'review',
    'test cricket', 'one day', 'twenty20', 'series', 'match', 'pitch', 'toss'
];

// Function to check if content is cricket-related
function isCricketRelated(title: string, content: string): boolean {
    const combinedText = `${title} ${content}`.toLowerCase();
    return CRICKET_KEYWORDS.some(keyword => combinedText.includes(keyword.toLowerCase()));
}

// Function to extract full article content
async function extractArticleContent(url: string, html: string): Promise<string> {
    const $ = cheerio.load(html);

    // Remove unwanted elements before extracting text
    $('script, style, noscript, iframe, nav, header, footer, aside, .ad, .advertisement, [class*="ad-"], [id*="ad-"]').remove();

    // Try multiple content selectors in order of preference
    let content = '';

    // Try article body (now cleaned)
    const articleBody = $('article').text().trim();
    if (articleBody && articleBody.length > 200) {
        content = articleBody;
    }

    // Try main content area
    if (!content) {
        const mainContent = $('main').text().trim();
        if (mainContent && mainContent.length > 200) {
            content = mainContent;
        }
    }

    // Try common content classes
    if (!content) {
        const contentDiv = $('.article-content, .story-content, .post-content, .entry-content').text().trim();
        if (contentDiv && contentDiv.length > 200) {
            content = contentDiv;
        }
    }

    // Try paragraphs within article
    if (!content) {
        const paragraphs = $('article p').map((_, el) => $(el).text().trim()).get().join(' ');
        if (paragraphs && paragraphs.length > 200) {
            content = paragraphs;
        }
    }

    // Clean up the content
    content = content
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
        .replace(/document\.currentScript[^}]*}/g, '') // Remove any remaining ad config scripts
        .replace(/\{[^}]*"ad-type"[^}]*\}/g, '') // Remove ad configuration objects
        .trim();

    // Limit to reasonable length (first 1000 characters)
    if (content.length > 1000) {
        content = content.substring(0, 1000) + '...';
    }

    return content || '';
}

export async function GET() {
    try {
        console.log('Starting cricket news fetch...');

        // 1. Auto-archive approved posts older than 24 hours
        const allPosts = getPosts();
        const approvedPosts = allPosts.filter(p => p.status === 'approved');
        let autoArchivedCount = 0;

        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        for (const post of approvedPosts) {
            if (post.timestamp < twentyFourHoursAgo) {
                updatePostStatus(post.id, 'archived', false);
                autoArchivedCount++;
                console.log(`Auto-archived post: ${post.id}`);
            }
        }

        // 2. Fetch new cricket posts from all sources
        const existingPosts = getPosts();
        let newPostsCount = 0;

        for (const feedUrl of RSS_FEEDS) {
            try {
                console.log(`Fetching from: ${feedUrl}`);
                const feed = await parser.parseURL(feedUrl);

                for (const item of feed.items) {
                    // Normalize title for comparison
                    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                    const newTitle = normalize(item.title || '');

                    // Check for duplicates based on URL or fuzzy title match
                    const isDuplicate = existingPosts.some(p => {
                        // 1. Exact URL match
                        if (p.sourceUrl === item.link) return true;

                        // 2. Fuzzy Title Match
                        const existingTitle = normalize(p.content);

                        // If titles are identical
                        if (existingTitle === newTitle) return true;

                        // If one title contains the other (and is significant length)
                        if (newTitle.length > 20 && (existingTitle.includes(newTitle) || newTitle.includes(existingTitle))) return true;

                        // Similarity check (simple Jaccard index on words)
                        const words1 = new Set(newTitle.split(/\s+/));
                        const words2 = new Set(existingTitle.split(/\s+/));
                        const intersection = new Set([...words1].filter(x => words2.has(x)));
                        const union = new Set([...words1, ...words2]);

                        // If 70% of words match, consider it a duplicate
                        return (intersection.size / union.size) > 0.7;
                    });

                    if (!isDuplicate && item.title && item.link) {
                        // First check if it's cricket-related
                        const itemContent = item.contentSnippet || item.content || '';
                        if (!isCricketRelated(item.title, itemContent)) {
                            console.log(`Skipping non-cricket article: ${item.title}`);
                            continue;
                        }

                        console.log(`Found new cricket article: ${item.title}`);

                        // Scrape for image and full content
                        let imageUrl = null;
                        let fullContent = '';

                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000);
                            const res = await fetch(item.link, {
                                signal: controller.signal,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                                }
                            });
                            clearTimeout(timeoutId);

                            if (res.ok) {
                                const html = await res.text();
                                const $ = cheerio.load(html);

                                // Extract full article content
                                fullContent = await extractArticleContent(item.link, html);

                                // Try multiple image sources in order of preference
                                const ogImage = $('meta[property="og:image"]').attr('content');
                                const twitterImage = $('meta[name="twitter:image"]').attr('content') || $('meta[property="twitter:image"]').attr('content');
                                const articleImage = $('article img').first().attr('src');
                                const firstImage = $('img[src]').first().attr('src');

                                // Use the first available image
                                imageUrl = ogImage || twitterImage || articleImage || firstImage || null;

                                // Ensure absolute URL
                                if (imageUrl && !imageUrl.startsWith('http')) {
                                    const baseUrl = new URL(item.link);
                                    if (imageUrl.startsWith('/')) {
                                        imageUrl = baseUrl.origin + imageUrl;
                                    } else {
                                        imageUrl = new URL(imageUrl, baseUrl.origin).href;
                                    }
                                }

                                // Filter out default/placeholder images
                                if (imageUrl && (imageUrl.includes('default') || imageUrl.includes('placeholder') || imageUrl.includes('logo'))) {
                                    imageUrl = null;
                                }

                                console.log(`Image found for ${item.title}: ${imageUrl}`);
                            }
                        } catch (e) {
                            console.warn(`Failed to scrape content for ${item.link}:`, e);
                        }

                        // STRICT RULE: Only add post if valid image found
                        if (imageUrl) {
                            // Use full content if available, otherwise use RSS snippet
                            const contentToUse = fullContent || itemContent;

                            const newPost: Post = {
                                id: uuidv4(),
                                content: item.title, // Store title as main content
                                imageUrl: imageUrl,
                                status: 'approved', // Auto-approve cricket posts immediately
                                timestamp: new Date(item.pubDate || Date.now()).getTime(),
                                sourceUrl: item.link,
                                highlights: contentToUse, // Store full content in highlights
                                keywords: ['cricket']
                            };

                            addPost(newPost);
                            newPostsCount++;
                            console.log(`Added cricket post: ${item.title}`);
                        } else {
                            console.log(`Skipping article due to missing image: ${item.title}`);
                        }
                    }
                }
            } catch (feedError) {
                console.error(`Failed to fetch feed ${feedUrl}:`, feedError);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fetched ${newPostsCount} new cricket articles, Auto-archived ${autoArchivedCount} posts`,
            newPostsCount,
            autoArchivedCount
        });
    } catch (error) {
        console.error('News fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
