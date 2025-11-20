'use client';

import React, { useState, useEffect } from 'react';
import AdSense from '@/components/AdSense';
import BreakingNews from '@/components/BreakingNews';
import SchemaOrg from '@/components/SchemaOrg';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  timestamp: number;
  sourceUrl?: string;
  highlights?: string;
  keywords?: string[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?status=approved');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPosts();

    // Auto-refresh every 10 seconds to show newly approved posts
    const interval = setInterval(fetchPosts, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Structured Data for SEO */}
      <SchemaOrg
        type="Website"
        data={{
          name: 'CricTrend',
          url: 'https://crictrend.vercel.app',
          description: 'Live cricket scores and latest cricket news',
        }}
      />
      <SchemaOrg
        type="Organization"
        data={{
          name: 'CricTrend',
          url: 'https://crictrend.vercel.app',
          description: 'Your source for live cricket scores and news',
        }}
      />

      {/* Breaking News Marquee */}
      <div style={{ marginBottom: '2rem', margin: '-2rem -2rem 2rem -2rem' }}>
        <BreakingNews posts={posts.slice(0, 5)} />
      </div>

      <header style={{ textAlign: 'center', margin: '2rem 0 1.5rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.05em',
          lineHeight: 1.2
        }}>
          Latest <span style={{ color: 'var(--primary)' }}>Cricket News</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', padding: '0 1rem' }}>Match reports, highlights, and trending stories.</p>

        {/* Manual Refresh Button */}
        <button
          onClick={async () => {
            setLoading(true);
            try {
              // First trigger a fresh fetch from RSS
              await fetch('/api/cron/news');
              // Then get the updated list
              const res = await fetch('/api/posts?status=approved');
              const data = await res.json();
              setPosts(data.posts);
            } catch (error) {
              console.error('Failed to fetch posts', error);
            } finally {
              setLoading(false);
            }
          }}
          className="btn"
          style={{
            marginTop: '1rem',
            padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            fontWeight: '600',
            transition: 'all 0.3s',
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
          onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh News'}
        </button>
      </header>

      {/* Top Banner Ad */}
      <div style={{ maxWidth: '970px', margin: '0 auto 2rem' }}>
        <AdSense
          adSlot="1234567890"
          adFormat="horizontal"
          style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading trends...</div>
      ) : posts.filter(p => Date.now() - p.timestamp < 2 * 24 * 60 * 60 * 1000).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <p>No recent news. Check the archive for older stories.</p>
        </div>
      ) : (
        <div className="grid">
          {posts
            .filter(post => Date.now() - post.timestamp < 2 * 24 * 60 * 60 * 1000) // Filter < 48 hours
            .map((post, index) => (
              <React.Fragment key={post.id}>
                <div
                  className="card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
                  onClick={() => setSelectedPost(post)}
                >
                  {post.imageUrl && (
                    <div style={{ height: 'clamp(180px, 35vw, 250px)', overflow: 'hidden' }}>
                      <img
                        src={post.imageUrl}
                        alt="Trend"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="post-image"
                      />
                    </div>
                  )}
                  <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
                    <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: '1.6', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                    <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#64748b' }}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* In-Content Ad - Show after every 4 articles */}
                {(index + 1) % 4 === 0 && index !== posts.filter(p => Date.now() - p.timestamp < 2 * 24 * 60 * 60 * 1000).length - 1 && (
                  <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                    <AdSense
                      adSlot="0987654321"
                      adFormat="rectangle"
                      style={{ display: 'block', textAlign: 'center' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>×</button>

            {selectedPost.imageUrl && (
              <div style={{ width: '100%', height: 'clamp(250px, 40vh, 400px)', overflow: 'hidden' }}>
                <img
                  src={selectedPost.imageUrl}
                  alt="Trend"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', marginBottom: '1.5rem', lineHeight: '1.3' }}>
                {selectedPost.content}
              </h2>

              {selectedPost.highlights && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Highlights</h4>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.6' }}>{selectedPost.highlights}</p>
                </div>
              )}

              {selectedPost.keywords && selectedPost.keywords.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {selectedPost.keywords.map((keyword, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: '#334155', color: '#cbd5e1' }}>
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem, 3vw, 2rem)', color: '#888', marginBottom: '2rem', alignItems: 'center', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                <span>{new Date(selectedPost.timestamp).toLocaleString()}</span>
                {selectedPost.sourceUrl && (
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                  >
                    Read Full Story →
                  </a>
                )}
              </div>

              <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: '1.8', color: '#ccc' }}>
                {/* Since we only have the title/snippet from RSS, we display it here. 
                    In a real app, we might fetch the full body content. */}
                {selectedPost.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
