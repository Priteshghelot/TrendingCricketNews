import { NextResponse } from 'next/server';
import { getPosts, addPost, Post } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

const parser = new Parser();
const NEWS_RSS_URL = 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml';

export async function GET() {
    try {
        console.log('Starting news fetch...');
        const feed = await parser.parseURL(NEWS_RSS_URL);
        const existingPosts = getPosts();
        let newPostsCount = 0;

        for (const item of feed.items) {
            // Check for duplicates based on link or title
            const isDuplicate = existingPosts.some(p =>
                p.sourceUrl === item.link || p.content.includes(item.title || '')
            );

            if (!isDuplicate && item.title && item.link) {
                console.log(`Found new article: ${item.title}`);

                // Scrape for image with multiple fallbacks
                let imageUrl = '/images/default-news.jpg'; // Default fallback
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
                        imageUrl = ogImage || twitterImage || articleImage || firstImage || imageUrl;

                        // Ensure absolute URL
                        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                            const baseUrl = new URL(item.link);
                            imageUrl = new URL(imageUrl, baseUrl.origin).href;
                        }

                        console.log(`Image found for ${item.title}: ${imageUrl}`);
                    }
                } catch (e) {
                    console.warn(`Failed to scrape image for ${item.link}:`, e);
                }

                const newPost: Post = {
                    id: uuidv4(),
                    content: `**${item.title}**\n\n${item.contentSnippet || item.content || ''}`,
                    imageUrl: imageUrl,
                    status: 'approved', // Auto-approve as requested
                    timestamp: new Date(item.pubDate || Date.now()).getTime(),
                    sourceUrl: item.link,
                    highlights: item.categories?.join(', ') || 'Cricket News'
                };

                addPost(newPost);
                newPostsCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fetched ${newPostsCount} new articles`,
            newPostsCount
        });
    } catch (error) {
        console.error('News fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
