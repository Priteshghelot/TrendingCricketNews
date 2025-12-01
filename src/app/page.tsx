'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getPublishedPosts, getScore } from '@/lib/store';
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
  body?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', body: '', imageUrl: '' });
  const previousPostIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async (isBackground = false) => {
      try {
        // 1. Fetch existing posts immediately
        const res = await fetch('/api/posts?status=approved');
        const data = await res.json();
        let newPosts = data.posts;

        // Strict Client-Side Sorting: Ensure consistent order (Newest First)
        // This prevents "flashing" or random reordering if API returns different order
        newPosts.sort((a: Post, b: Post) => {
          if (b.timestamp !== a.timestamp) {
            return b.timestamp - a.timestamp;
          }
          return b.id.localeCompare(a.id);
        });

        // Update state only if data has changed to prevent re-renders/flashing
        setPosts(prevPosts => {
          const isDifferent = JSON.stringify(prevPosts) !== JSON.stringify(newPosts);
          return isDifferent ? newPosts : prevPosts;
        });

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

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const cookies = document.cookie.split(';');
      const authToken = cookies.find(c => c.trim().startsWith('auth_token='));
      setIsAdmin(!!authToken);
    };
    checkAdmin();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.content) return alert('Headline is required');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          status: 'approved',
          highlights: newPost.body.substring(0, 150) + '...'
        })
      });

      if (res.ok) {
        alert('Post published successfully!');
        setIsCreating(false);
        setNewPost({ content: '', body: '', imageUrl: '' });
        // Refresh posts immediately
        const refreshRes = await fetch('/api/posts?status=approved');
        const data = await refreshRes.json();
        setPosts(data.posts.sort((a: Post, b: Post) => b.timestamp - a.timestamp));
      } else {
        alert('Failed to publish post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPost || isCreating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost, isCreating]);

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

      <header style={{ textAlign: 'center', margin: '2rem 0 1.5rem', position: 'relative' }}>
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

        {isAdmin && (
          <button
            onClick={() => setIsCreating(true)}
            style={{
              marginTop: '1rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ➕ Add News
          </button>
        )}
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
                    <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: '1.6', marginBottom: '0.5rem', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                    {post.highlights && (
                      <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', lineHeight: '1.5', color: '#94a3b8', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.highlights}
                      </p>
                    )}
                    {post.body && (
                      <p style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', lineHeight: '1.5', color: '#cbd5e1', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.body}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#64748b' }}>
                        {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                    </div>
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

      {/* Create Post Modal */}
      {isCreating && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setIsCreating(false)}
        >
          <div
            style={{
              background: '#1e293b',
              padding: '2rem',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              border: '1px solid #334155'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>📝 Write New Article</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Headline</label>
              <input
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Enter catchy headline..."
                style={{ width: '100%', padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Image URL</label>
              <input
                value={newPost.imageUrl}
                onChange={e => setNewPost({ ...newPost, imageUrl: e.target.value })}
                placeholder="https://..."
                style={{ width: '100%', padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Article Body</label>
              <textarea
                value={newPost.body}
                onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Write your story here..."
                style={{ width: '100%', height: '200px', padding: '0.8rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleCreatePost}
                style={{ flex: 1, padding: '0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                Publish Now
              </button>
              <button
                onClick={() => setIsCreating(false)}
                style={{ flex: 1, padding: '0.8rem', background: '#475569', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
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
                {selectedPost.highlights && (
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Highlights</h4>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{selectedPost.highlights}</p>
                  </div>
                )}
                {selectedPost.body && (
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9' }}>
                    {selectedPost.body}
                  </div>
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
