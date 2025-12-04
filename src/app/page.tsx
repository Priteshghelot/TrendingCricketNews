import Link from 'next/link';
import { getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';
import LiveScoreBar from '@/components/LiveScoreBar';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
    const posts = await getApprovedPosts();

    return (
        <>
            {/* Live Score Bar */}
            <LiveScoreBar />

            {/* Main Content */}
            <div className="container">
                <div className="main-layout">
                    {/* Left Column: News Feed */}
                    <div className="news-feed">
                        {/* Top Ad */}
                        <div className="ad-container">
                            <AdSense adSlot="1234567890" adFormat="horizontal" />
                        </div>

                        <h2 style={{
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            borderLeft: '4px solid var(--primary-blue)',
                            paddingLeft: '0.5rem'
                        }}>
                            Latest News
                        </h2>

                        {posts.length === 0 ? (
                            <div className="empty-state">
                                <p>No news articles yet.</p>
                            </div>
                        ) : (
                            <div className="news-list">
                                {posts.map((post) => (
                                    <Link href={`/news/${post.id}`} key={post.id} className="news-card-compact">
                                        {post.imageUrl ? (
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="news-card-image-compact"
                                            />
                                        ) : (
                                            <div style={{
                                                width: '240px',
                                                height: '100%',
                                                background: '#eee',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#aaa',
                                                flexShrink: 0
                                            }}>
                                                No Image
                                            </div>
                                        )}
                                        <div className="news-card-content-compact">
                                            <span className="news-card-tag">Cricket</span>
                                            <h3 className="news-card-title-compact">{post.title}</h3>
                                            <p style={{
                                                fontSize: '0.9rem',
                                                color: '#555',
                                                marginBottom: '0.5rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {post.body.substring(0, 120)}...
                                            </p>
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

                    {/* Right Column: Sidebar */}
                    <Sidebar />
                </div>
            </div>
        </>
    );
}
