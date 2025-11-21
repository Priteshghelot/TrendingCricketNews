import { NextResponse } from 'next/server';
import { getPosts, addPost, updatePostStatus, Post } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

const parser = new Parser();

// Multiple RSS feeds for broader coverage
const RSS_FEEDS = [
    'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
    'http://newsrss.bbc.co.uk/rss/sportonline_uk_edition/cricket/rss.xml',
    'https://www.skysports.com/rss/12040' // Sky Sports Cricket
];

export async function GET() {
    try {
        console.log('Starting news fetch...');

        // 1. Auto-approve pending posts older than 10 minutes
        // AND Auto-archive approved posts older than 24 hours
        const allPosts = getPosts();
        const pendingPosts = allPosts.filter(p => p.status === 'pending');
        const approvedPosts = allPosts.filter(p => p.status === 'approved');
        let autoApprovedCount = 0;
        let autoArchivedCount = 0;

        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        for (const post of pendingPosts) {
            if (post.timestamp < tenMinutesAgo) {
                updatePostStatus(post.id, 'approved', true);
                autoApprovedCount++;
                console.log(`Auto-approved post: ${post.id}`);
            }
        }

        for (const post of approvedPosts) {
            if (post.timestamp < twentyFourHoursAgo) {
                updatePostStatus(post.id, 'archived', false); // Don't update timestamp when archiving
                autoArchivedCount++;
                console.log(`Auto-archived post: ${post.id}`);
            }
        }

        // 2. Fetch new posts from all sources
        const existingPosts = getPosts();
        let newPostsCount = 0;

        for (const feedUrl of RSS_FEEDS) {
            try {
                console.log(`Fetching from: ${feedUrl}`);
                const feed = await parser.parseURL(feedUrl);

                for (const item of feed.items) {
                    // Check for duplicates based on link or title
                    const isDuplicate = existingPosts.some(p =>
                        p.sourceUrl === item.link || p.content.includes(item.title || '')
                    );

                    if (!isDuplicate && item.title && item.link) {
                        console.log(`Found new article: ${item.title}`);

                        // Scrape for image with multiple fallbacks
                        let imageUrl = null;
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

                                // Try multiple image sources in order of preference
                                const ogImage = $('meta[property="og:image"]').attr('content');
                                const twitterImage = $('meta[name="twitter:image"]').attr('content') || $('meta[property="twitter:image"]').attr('content');
                                const articleImage = $('article img').first().attr('src');
                                const firstImage = $('img[src]').first().attr('src');

                                // Use the first available image
                                imageUrl = ogImage || twitterImage || articleImage || firstImage || null;

                                // Ensure absolute URL
                                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                                    const baseUrl = new URL(item.link);
                                    imageUrl = new URL(imageUrl, baseUrl.origin).href;
                                }

                                // Filter out default/placeholder images if known (basic check)
                                if (imageUrl && (imageUrl.includes('default') || imageUrl.includes('placeholder'))) {
                                    imageUrl = null;
                                }

                                console.log(`Image found for ${item.title}: ${imageUrl}`);
                            }
                        } catch (e) {
                            console.warn(`Failed to scrape image for ${item.link}:`, e);
                        }

                        // STRICT RULE: Only add post if valid image found
                        if (imageUrl) {
                            const newPost: Post = {
                                id: uuidv4(),
                                content: `**${item.title}**\n\n${item.contentSnippet || item.content || ''}`,
                                imageUrl: imageUrl,
                                status: 'pending', // Default to pending, will be auto-approved later
                                timestamp: new Date(item.pubDate || Date.now()).getTime(),
                                sourceUrl: item.link,
                                highlights: item.categories?.join(', ') || 'Cricket News'
                            };

                            addPost(newPost);
                            newPostsCount++;
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
            message: `Fetched ${newPostsCount} new articles, Auto-approved ${autoApprovedCount} pending posts, Auto-archived ${autoArchivedCount} posts`,
            newPostsCount,
            autoApprovedCount,
            autoArchivedCount
        });
    } catch (error) {
        console.error('News fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
