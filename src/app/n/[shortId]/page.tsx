import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getPosts, getPostById } from '@/lib/store';
import { createShortId } from '@/lib/shortId';

interface Props {
    params: Promise<{
        shortId: string;
    }>;
}

// Find the full ID from short ID
function findPostByShortId(shortId: string): string | null {
    const posts = getPosts();
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
    const fullId = findPostByShortId(shortId);

    if (!fullId) {
        return {
            title: 'CricTrend - Latest Cricket News',
            description: 'Get the fastest cricket news, live scores, and breaking updates.',
        };
    }

    const post = getPostById(fullId);

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
            url: `https://cricktrend.vercel.app/n/${shortId}`,
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
                    url: 'https://cricktrend.vercel.app/images/default-news.jpg',
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
            images: post.imageUrl ? [post.imageUrl] : ['https://cricktrend.vercel.app/images/default-news.jpg'],
        },
    };
}

export default async function ShortLinkPage({ params }: Props) {
    const { shortId } = await params;

    // Find the full post ID
    const fullId = findPostByShortId(shortId);

    if (!fullId) {
        // Post not found, redirect to homepage
        redirect('/');
    }

    const post = getPostById(fullId);
    const redirectUrl = `/news/${fullId}`;

    // Return a page that shows metadata to crawlers but redirects humans
    return (
        <html>
            <head>
                {/* Meta refresh for browsers */}
                <meta httpEquiv="refresh" content="0;url={redirectUrl}" />
                {/* Canonical URL */}
                <link rel="canonical" href={`https://cricktrend.vercel.app${redirectUrl}`} />
            </head>
            <body>
                {/* Fallback content */}
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Redirecting to article...</p>
                    <p>
                        <a href={redirectUrl} style={{ color: '#3b82f6' }}>
                            Click here if you are not redirected automatically
                        </a>
                    </p>
                </div>
                {/* Client-side redirect as backup */}
                <script dangerouslySetInnerHTML={{
                    __html: `window.location.href = '${redirectUrl}';`
                }} />
            </body>
        </html>
    );
}

// Generate static params for recent posts
export async function generateStaticParams() {
    const posts = getPosts();
    const recentPosts = posts
        .filter(p => p.status === 'approved')
        .slice(0, 200);

    return recentPosts.map((post) => ({
        shortId: createShortId(post.id),
    }));
}

export const dynamicParams = true;
