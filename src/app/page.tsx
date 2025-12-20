import Link from 'next/link';
import NextImage from 'next/image';
import { getApprovedPosts } from '@/lib/store';
import AdSense from '@/components/AdSense';
import BreakingNewsBar from '@/components/BreakingNewsBar';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
    const posts = await getApprovedPosts();

    return (
        <>
            {/* Breaking News Bar */}
            <BreakingNewsBar />

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
                                {/* Hero Article */}
                                {posts[0] && (
                                    <Link href={`/news/${posts[0].id}`} className="hero-card">
                                        <div className="hero-image-container">
                                            {posts[0].imageUrl ? (
                                                <NextImage
                                                    src={posts[0].imageUrl}
                                                    alt={posts[0].title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    priority
                                                />
                                            ) : (
                                                <div className="hero-placeholder" />
                                            )}
                                            <div className="hero-overlay" />
                                        </div>
                                        <div className="hero-content">
                                            <span className="hero-tag">
                                                Breaking News
                                            </span>
                                            <h2 className="hero-title">
                                                {posts[0].title}
                                            </h2>
                                            {/* Summary removed as per user request */}
                                        </div>
                                    </Link>
                                )}

                                {/* Remaining Articles Grid */}
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {posts.slice(1).map((post) => (
                                        <Link href={`/news/${post.id}`} key={post.id} className="news-card-compact" style={{
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}>
                                            {post.imageUrl ? (
                                                <div className="news-card-image-compact" style={{ position: 'relative', width: '240px', height: '100%', flexShrink: 0 }}>
                                                    <NextImage
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
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
                                                <h3 className="news-card-title-compact" style={{ fontSize: '1.1rem' }}>{post.title}</h3>
                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: '#555',
                                                    marginBottom: '0.5rem',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {post.body
                                                        .replace(/[#*`]/g, '')
                                                        .substring(0, 120)}...
                                                </p>
                                                <div className="news-card-meta">
                                                    {new Date(post.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        timeZone: 'UTC'
                                                    })}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
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
