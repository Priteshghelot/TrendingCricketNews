import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/lib/store';
import AdSense from '@/components/AdSense';
import SchemaOrg from '@/components/SchemaOrg';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = getPostById(id);

    if (!post) {
        return {
            title: 'Story Not Found',
            description: 'The requested cricket news story could not be found.',
        };
    }

    return {
        title: post.content.substring(0, 60) + (post.content.length > 60 ? '...' : ''),
        description: post.highlights || post.content.substring(0, 160),
        openGraph: {
            title: post.content.substring(0, 60),
            description: post.highlights || post.content.substring(0, 160),
            images: post.imageUrl ? [{ url: post.imageUrl }] : [],
            type: 'article',
            publishedTime: new Date(post.timestamp).toISOString(),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.content.substring(0, 60),
            description: post.highlights || post.content.substring(0, 160),
            images: post.imageUrl ? [post.imageUrl] : [],
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
            {/* Structured Data */}
            <SchemaOrg
                type="NewsArticle"
                data={{
                    headline: post.content.substring(0, 110),
                    image: post.imageUrl ? [post.imageUrl] : [],
                    datePublished: new Date(post.timestamp).toISOString(),
                    dateModified: new Date(post.timestamp).toISOString(),
                    author: [{ name: 'CricTrend', url: 'https://crictrend.vercel.app' }],
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
                            <p style={{ margin: 0 }}>{post.highlights}</p>
                        </div>
                    )}

                    <p>{post.content}</p>

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
