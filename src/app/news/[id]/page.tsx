import { notFound } from 'next/navigation';
import { getPostById, getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';
import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const posts = await getApprovedPosts();
    return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        return { title: 'Not Found' };
    }

    const url = `https://crictrend.vercel.app/news/${post.id}`;
    const description = post.body.substring(0, 160);

    // Ensure image URL is absolute for social media
    const imageUrl = post.imageUrl
        ? (post.imageUrl.startsWith('http') ? post.imageUrl : `https://crictrend.vercel.app${post.imageUrl}`)
        : 'https://crictrend.vercel.app/default-cricket.jpg';

    return {
        title: post.title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'article',
            title: post.title,
            description,
            url,
            siteName: 'CricTrend',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            publishedTime: new Date(post.timestamp).toISOString(),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    // Structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        image: post.imageUrl || 'https://crictrend.vercel.app/default-cricket.jpg',
        datePublished: new Date(post.timestamp).toISOString(),
        dateModified: new Date(post.timestamp).toISOString(),
        author: {
            '@type': 'Organization',
            name: 'CricTrend',
            url: 'https://crictrend.vercel.app',
        },
        publisher: {
            '@type': 'Organization',
            name: 'CricTrend',
            logo: {
                '@type': 'ImageObject',
                url: 'https://crictrend.vercel.app/logo.png',
            },
        },
        description: post.body.substring(0, 160),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://crictrend.vercel.app/news/${post.id}`,
        },
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <article className="article">
                <header className="article-header">
                    <h1 className="article-title">{post.title}</h1>
                    <p className="article-meta">
                        Published on{' '}
                        {new Date(post.timestamp).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC'
                        })}
                    </p>
                </header>

                {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="article-image" />
                )}

                {/* Share Buttons */}
                <ShareButtons
                    title={post.title}
                    url={`https://crictrend.vercel.app/news/${post.id}`}
                />

                {/* Ad in article */}
                <div className="ad-container">
                    <AdSense adSlot="1122334455" adFormat="rectangle" />
                </div>

                <div className="article-body">
                    {post.body.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {/* Bottom Ad */}
                <div className="ad-container">
                    <AdSense adSlot="5566778899" adFormat="auto" />
                </div>
            </article>
        </>
    );
}
