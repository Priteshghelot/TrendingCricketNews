import { notFound } from 'next/navigation';
import { getPostById, getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';

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

    return {
        title: post.title,
        description: post.body.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.body.substring(0, 160),
            images: post.imageUrl ? [post.imageUrl] : [],
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
