import { NextResponse } from 'next/server';
import { addPost, getPosts } from '@/lib/store';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser();
const RSS_URL = 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml';

export async function POST() {
    try {
        const feed = await parser.parseURL(RSS_URL);
        const existingPosts = getPosts();
        const newPosts = [];

        // Process only the first 6 items to avoid timeout/rate limits
        const itemsToProcess = feed.items.slice(0, 6);

        for (const item of itemsToProcess) {
            // Simple check to avoid duplicates based on title
            const isDuplicate = existingPosts.some(p => p.content === item.title);

            if (!isDuplicate && item.title) {
                // Default cricket placeholder
                let imageUrl = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60';
                let highlights = '';
                let keywords: string[] = [];

                // Try to fetch the real content from the article URL
                if (item.link) {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

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

                            // Extract Image
                            const ogImage = $('meta[property="og:image"]').attr('content') ||
                                $('meta[name="twitter:image"]').attr('content');
                            if (ogImage) {
                                imageUrl = ogImage;
                                if (imageUrl.startsWith('/')) {
                                    const urlObj = new URL(item.link);
                                    imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
                                }
                            }

                            // Extract Highlights (Description)
                            highlights = $('meta[property="og:description"]').attr('content') ||
                                $('meta[name="description"]').attr('content') || '';

                            // Extract Keywords
                            const keywordsStr = $('meta[name="keywords"]').attr('content');
                            if (keywordsStr) {
                                keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 5);
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to scrape details for', item.link);
                    }
                }

                const newPost = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    content: item.title,
                    imageUrl: imageUrl,
                    status: 'pending' as const,
                    timestamp: Date.now(),
                    sourceUrl: item.link,
                    highlights: highlights,
                    keywords: keywords
                };

                addPost(newPost);
                newPosts.push(newPost);
            }
        }

        return NextResponse.json({ success: true, count: newPosts.length, posts: newPosts });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }
}
