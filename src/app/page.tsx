import Link from 'next/link';
import { getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
    const posts = await getApprovedPosts();

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1>🏏 CricTrend</h1>
                    <p>The Pulse of Cricket. Breaking News, Live Scores & In-Depth Analysis.</p>
                </div>
            </section>

            {/* Ad Banner */}
            <div className="container">
                <div className="ad-container">
                    <AdSense adSlot="1234567890" adFormat="horizontal" />
                </div>
            </div>

            {/* News Grid */}
            <div className="container">
                {posts.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            No news articles yet. Be the first to post!
                        </p>
                        <Link href="/login" className="btn btn-primary" style={{
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '999px',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}>
                            Go to Admin Panel
                        </Link>
                    </div>
                ) : (
                    <div className="news-grid">
                        {posts.map((post) => (
                            <Link href={`/news/${post.id}`} key={post.id} className="news-card">
                                <div className="news-card-image-wrapper">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="news-card-image"
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(45deg, var(--bg-secondary), var(--bg-primary))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            🏏 No Image
                                        </div>
                                    )}
                                </div>
                                <div className="news-card-content">
                                    <span className="news-card-tag">Cricket</span>
                                    <h2 className="news-card-title">{post.title}</h2>
                                    <div className="news-card-meta">
                                        {new Date(post.timestamp).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Ad */}
            <div className="container" style={{ marginBottom: '4rem' }}>
                <div className="ad-container">
                    <AdSense adSlot="0987654321" adFormat="auto" />
                </div>
            </div>
        </>
    );
}
