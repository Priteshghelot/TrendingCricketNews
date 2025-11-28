'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';
import BreakingNews from '@/components/BreakingNews';
import SchemaOrg from '@/components/SchemaOrg';
import ShareButtons from '@/components/ShareButtons';
import NotificationPrompt from '@/components/NotificationPrompt';
import { trackModalOpen } from '@/lib/analytics';
import { notifyNewCricketNews, getNotificationPermission } from '@/lib/push';

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
  const previousPostIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async (isBackground = false) => {
      try {
        // 1. Fetch existing posts immediately
        const res = await fetch('/api/posts?status=approved');
        const data = await res.json();
        const newPosts = data.posts;

        // Update state immediately
        setPosts(newPosts);
        if (!isBackground) setLoading(false);

        // Check for new posts and send notifications
        if (previousPostIds.current.size > 0 && getNotificationPermission() === 'granted') {
          newPosts.forEach((post: Post) => {
            if (!previousPostIds.current.has(post.id)) {
              notifyNewCricketNews(post.content, post.id, post.imageUrl);
            }
          });
        }

        previousPostIds.current = new Set(newPosts.map((p: Post) => p.id));

        // 2. Trigger background news fetch (non-blocking)
        // Only do this on initial load or if explicitly requested
        if (!isBackground) {
          fetch('/api/cron/news').then(() => {
            // After background fetch is done, refresh posts silently
            fetchPosts(true);
          }).catch(console.error);
        }

      } catch (error) {
        console.error('Failed to fetch posts', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPosts();

    // Auto-refresh every 10 seconds (check for new posts in DB only)
    const interval = setInterval(() => {
      fetchPosts(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  // Show all approved posts (not just recent 24h)
  const approvedPosts = posts;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <NotificationPrompt />
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
        <p style={{ color: '#94a3b8', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', padding: '0 1rem' }}>
          Match reports, highlights, and trending stories. Auto-updates every 10 seconds.
        </p>
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
      ) : approvedPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <p>No news available. Check back soon!</p>
        </div>
      ) : (
        <div className="grid">
          {approvedPosts
            .map((post, index) => (
              <React.Fragment key={post.id}>
                <div
                  onClick={() => {
                    setSelectedPost(post);
                    trackModalOpen(post.content);
                  }}
                  className="card animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    cursor: 'pointer',
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
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
                {(index + 1) % 4 === 0 && index !== approvedPosts.length - 1 && (
                  <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                    <AdSense
                      adSlot="0987654321"
                      adFormat="rectangle"
                      style={{ display: 'block', textAlign: 'center' }}
                      suppressHydrationWarning={true}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}

      {/* Modal for News Details */}
      {selectedPost && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.3s ease',
            overflowY: 'auto'
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              animation: 'slideUp 0.3s ease',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: 'white',
                zIndex: 10,
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              ×
            </button>

            {/* Modal Content */}
            {selectedPost.imageUrl && (
              <div style={{ width: '100%', height: 'auto', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.content}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                lineHeight: '1.3',
                marginBottom: '1rem',
                color: '#fff'
              }}>
                {selectedPost.content}
              </h2>

              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Published on {new Date(selectedPost.timestamp).toLocaleDateString()} at {new Date(selectedPost.timestamp).toLocaleTimeString()}
              </div>

              <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#e2e8f0',
                marginBottom: '2rem'
              }}>
                {selectedPost.highlights ? (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.highlights}</p>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                    Full details for this story are available on the source website. Click the button below to read more.
                  </p>
                )}
              </div>

              {selectedPost.sourceUrl && (
                <div style={{ marginTop: '2rem' }}>
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Read Full Story on Source →
                  </a>
                </div>
              )}

              {/* Share Buttons */}
              <ShareButtons
                title={selectedPost.content}
                url={`https://crictrend.vercel.app/news/${selectedPost.id}`}
                postId={selectedPost.id}
              />

              {selectedPost.keywords && selectedPost.keywords.length > 0 && (
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #334155' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>TOPICS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedPost.keywords.map((keyword, idx) => (
                      <span key={idx} style={{ background: '#1e293b', color: '#cbd5e1', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
