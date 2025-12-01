import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getPosts, getPostById } from '@/lib/store';
import { createShortId } from '@/lib/shortId';
import ClientRedirect from '@/components/ClientRedirect';

interface Props {
    params: Promise<{
        shortId: string;
    }>;
}

// Find the full ID from short ID
async function findPostByShortId(shortId: string): Promise<string | null> {
    const posts = await getPosts();
    for (const post of posts) {
        if (createShortId(post.id) === shortId) {
            return post.id;
        }
    }
    return null;
}

// Generate metadata for social media sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { shortId } = await params;
    const fullId = await findPostByShortId(shortId);

    if (!fullId) {
        return {
            title: 'CricTrend - Latest Cricket News',
            description: 'Get the fastest cricket news, live scores, and breaking updates.',
        };
    }

    const post = await getPostById(fullId);

    if (!post) {
        return {
            title: 'CricTrend - Latest Cricket News',
            description: 'Get the fastest cricket news, live scores, and breaking updates.',
        };
    }

    // Create SEO-optimized title
    const seoTitle = post.content.length > 55
        ? post.content.substring(0, 52) + '...'
        : post.content;

    // Create meta description
    const metaDescription = post.highlights
        ? post.highlights.substring(0, 157) + '...'
        : `${post.content.substring(0, 140)}... Read more on CricTrend.`;

    return {
        title: `${seoTitle} | CricTrend`,
        description: metaDescription,
        openGraph: {
            title: seoTitle,
            description: metaDescription,
            url: `https://crictrend.vercel.app/n/${shortId}`,
            siteName: 'CricTrend',
            images: post.imageUrl ? [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.content,
                }
            ] : [
                {
                    url: 'https://crictrend.vercel.app/images/default-news.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'CricTrend - Latest Cricket News',
                }
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            site: '@crictrend',
            creator: '@crictrend',
            title: seoTitle,
            description: metaDescription,
            images: post.imageUrl ? [{
                url: post.imageUrl,
                alt: post.content,
            }] : ['https://crictrend.vercel.app/images/default-news.jpg'],
        },
        other: {
            'twitter:domain': 'cricktrend.vercel.app',
            'twitter:url': `https://cricktrend.vercel.app/n/${shortId}`,
        },
    };
}

export default async function ShortLinkPage({ params }: Props) {
    const { shortId } = await params;

    // Find the full post ID
    const fullId = await findPostByShortId(shortId);

    if (!fullId) {
        // Post not found, redirect to homepage
        redirect('/');
    }

    const redirectUrl = `/news/${fullId}`;

    // Render the client redirect component
    // The metadata will be injected into the head by the layout via generateMetadata
    return <ClientRedirect url={redirectUrl} />;
}

// Generate static params for recent posts
export async function generateStaticParams() {
    const posts = await getPosts();
    const recentPosts = posts
        .filter(p => p.status === 'approved')
        .slice(0, 200);

    return recentPosts.map((post) => ({
        shortId: createShortId(post.id),
    }));
}

export const dynamicParams = true;
