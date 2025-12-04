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
                    <p>Your source for the latest cricket news and updates</p>
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
                    <div className="empty-state">
                        <p>No news articles yet. Add some from the Admin panel!</p>
                        <Link href="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Go to Admin
                        </Link>
                    </div>
                ) : (
                    <div className="news-grid">
                        {posts.map((post) => (
                            <Link href={`/news/${post.id}`} key={post.id} className="news-card">
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="news-card-image"
                                    />
                                )}
                                <div className="news-card-content">
                                    <h2 className="news-card-title">{post.title}</h2>
                                    <p className="news-card-meta">
                                        {new Date(post.timestamp).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Ad */}
            <div className="container">
                <div className="ad-container">
                    <AdSense adSlot="0987654321" adFormat="auto" />
                </div>
            </div>
        </>
    );
}
