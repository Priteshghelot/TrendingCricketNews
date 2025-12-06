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
                                    <Link href={`/news/${posts[0].id}`} className="hero-card" style={{
                                        display: 'block',
                                        marginBottom: '2rem',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        aspectRatio: '16/9',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                        border: '1px solid #333'
                                    }}>
                                        <div style={{ position: 'absolute', inset: 0 }}>
                                            {posts[0].imageUrl ? (
                                                <NextImage
                                                    src={posts[0].imageUrl}
                                                    alt={posts[0].title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    priority
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#333' }} />
                                            )}
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                                            }} />
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: '2rem',
                                            color: '#fff'
                                        }}>
                                            <span style={{
                                                background: 'var(--danger)',
                                                color: '#fff',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                marginBottom: '0.75rem',
                                                display: 'inline-block'
                                            }}>
                                                Breaking News
                                            </span>
                                            <h2 style={{
                                                fontSize: '2rem',
                                                fontWeight: '900',
                                                marginBottom: '0.75rem',
                                                lineHeight: 1.2,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                            }}>
                                                {posts[0].title}
                                            </h2>
                                            <p style={{
                                                fontSize: '1rem',
                                                color: '#ddd',
                                                maxWidth: '800px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {posts[0].body}
                                            </p>
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
                                                    {post.body.substring(0, 120)}...
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
