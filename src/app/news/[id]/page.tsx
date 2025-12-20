import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById, getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';
import ShareButtons from '@/components/ShareButtons';
import Comments from '@/components/Comments';

export const dynamic = 'force-dynamic';

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
    // getPostById now handles safe decoding
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
                {/* Breadcrumbs */}
                <nav style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--primary-blue)' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>&rsaquo;</span>
                    <Link href="/" style={{ color: 'var(--primary-blue)' }}>News</Link>
                    <span style={{ margin: '0 0.5rem' }}>&rsaquo;</span>
                    <span style={{ color: '#999' }}>{post.title.substring(0, 30)}...</span>
                </nav>

                <header className="article-header">
                    <h1 className="article-title">{post.title}</h1>
                    <div className="article-meta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span>
                            {new Date(post.timestamp).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })}
                        </span>
                        <span style={{ color: '#ccc' }}>|</span>
                        <span>{Math.max(1, Math.ceil(post.body.split(/\s+/).length / 200))} min read</span>
                    </div>
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

                {/* Author Signature */}
                <div style={{
                    marginTop: '3rem',
                    padding: '1.5rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-blue)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>
                        CT
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>CricTrend Editorial Team</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Providing real-time cricket updates and expert analysis since 2024.</p>
                    </div>
                </div>

                {/* Bottom Ad */}
                <div className="ad-container">
                    <AdSense adSlot="5566778899" adFormat="auto" />
                </div>

                {/* Comments Section */}
                <Comments postId={post.id} />
            </article>
        </>
    );
}
