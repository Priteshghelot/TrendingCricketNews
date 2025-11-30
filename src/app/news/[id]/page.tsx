import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById, getPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';
import SchemaOrg from '@/components/SchemaOrg';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

// Generate static paths for the most recent 200 posts
export async function generateStaticParams() {
    const posts = getPosts();
    // Get recent approved posts (limit to 200 for build performance)
    const recentPosts = posts
        .filter(p => p.status === 'approved')
        .slice(0, 200);

    return recentPosts.map((post) => ({
        id: post.id,
    }));
}

// Enable dynamic rendering for posts not pre-generated
export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = getPostById(id);

    if (!post) {
        return {
            title: 'Cricket News Not Found | CricTrend',
            description: 'The requested cricket news story could not be found. Visit CricTrend for latest cricket news, live scores, and match updates.',
        };
    }

    // Extract keywords from content
    const keywords = [
        'cricket news',
        'latest cricket',
        'cricket updates',
        ...(post.keywords || ['cricket']),
    ];

    // Create SEO-optimized title (under 60 chars for Google)
    const seoTitle = post.content.length > 55
        ? post.content.substring(0, 52) + '...'
        : post.content;

    // Create compelling meta description (under 160 chars)
    const metaDescription = post.highlights
        ? post.highlights.substring(0, 157) + '...'
        : `${post.content.substring(0, 140)}... Read the full cricket news story on CricTrend.`;

    return {
        title: `${seoTitle} | CricTrend`,
        description: metaDescription,
        keywords: keywords.join(', '),
        authors: [{ name: 'CricTrend' }],
        publisher: 'CricTrend',
        alternates: {
            canonical: `https://crictrend.vercel.app/news/${id}`,
        },
        openGraph: {
            title: seoTitle,
            description: metaDescription,
            url: `https://crictrend.vercel.app/news/${id}`,
            siteName: 'CricTrend',
            images: post.imageUrl ? [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.content,
                }
            ] : [],
            type: 'article',
            publishedTime: new Date(post.timestamp).toISOString(),
            modifiedTime: new Date(post.timestamp).toISOString(),
            authors: ['CricTrend'],
            section: 'Cricket News',
            tags: keywords,
        },
        twitter: {
            card: 'summary_large_image',
            site: '@crictrend',
            creator: '@crictrend',
            title: seoTitle,
            description: metaDescription,
            images: post.imageUrl ? [post.imageUrl] : [],
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    };
}

export default async function NewsPage({ params }: Props) {
    const { id } = await params;
    const post = getPostById(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Enhanced Structured Data for Google */}
            <SchemaOrg
                type="NewsArticle"
                data={{
                    headline: post.content.substring(0, 110),
                    description: post.highlights || post.content,
                    image: post.imageUrl ? [post.imageUrl] : ['https://crictrend.vercel.app/images/default-news.jpg'],
                    datePublished: new Date(post.timestamp).toISOString(),
                    dateModified: new Date(post.timestamp).toISOString(),
                    author: [
                        {
                            '@type': 'Organization',
                            name: 'CricTrend',
                            url: 'https://crictrend.vercel.app',
                        }
                    ],
                    publisher: {
                        '@type': 'Organization',
                        name: 'CricTrend',
                        logo: {
                            '@type': 'ImageObject',
                            url: 'https://crictrend.vercel.app/images/default-news.jpg',
                        },
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': `https://crictrend.vercel.app/news/${post.id}`,
                    },
                    articleSection: 'Cricket News',
                    keywords: (post.keywords || ['cricket']).join(', '),
                }}
            />

            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: '500' }}>
                ← Back to Home
            </Link>

            <article>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: '1.3', marginBottom: '1rem' }}>
                        {post.content}
                    </h1>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Published on {new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString()}
                    </div>
                </header>

                {post.imageUrl && (
                    <div style={{ width: '100%', height: 'auto', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <img
                            src={post.imageUrl}
                            alt={post.content}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                )}

                {/* AdSense before content */}
                <div style={{ margin: '2rem 0', textAlign: 'center' }}>
                    <AdSense
                        adSlot="9876543210"
                        adFormat="auto"
                        fullWidthResponsive={true}
                        style={{ display: 'block' }}
                        suppressHydrationWarning={true}
                    />
                </div>

                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e2e8f0' }}>
                    {post.highlights && (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase' }}>Highlights</h3>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{post.highlights}</p>
                        </div>
                    )}

                    {post.body ? (
                        <div style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                            {post.body}
                        </div>
                    ) : (
                        <p>{post.content}</p>
                    )}

                    {post.sourceUrl && (
                        <div style={{ marginTop: '2rem' }}>
                            <a
                                href={post.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                Read Full Story on Source →
                            </a>
                        </div>
                    )}
                </div>

                {/* Keywords */}
                {post.keywords && post.keywords.length > 0 && (
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #334155' }}>
                        <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>TOPICS</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {post.keywords.map((keyword, idx) => (
                                <span key={idx} style={{ background: '#1e293b', color: '#cbd5e1', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                                    #{keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* AdSense after content */}
            <div style={{ margin: '3rem 0', textAlign: 'center' }}>
                <AdSense
                    adSlot="5432109876"
                    adFormat="auto"
                    fullWidthResponsive={true}
                    style={{ display: 'block' }}
                    suppressHydrationWarning={true}
                />
            </div>
        </div>
    );
}
