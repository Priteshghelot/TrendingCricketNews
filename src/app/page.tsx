'use client';

import { useState, useEffect } from 'react';

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

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <header style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>
          Latest <span style={{ color: 'var(--primary)' }}>Cricket News</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Match reports, highlights, and trending stories.</p>
      </header>

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
              <div
                key={post.id}
                className="card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
                onClick={() => setSelectedPost(post)}
              >
                {post.imageUrl && (
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <img
                      src={post.imageUrl}
                      alt="Trend"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      className="post-image"
                    />
                  </div>
                )}
                <div style={{ padding: '2rem' }}>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>×</button>

            {selectedPost.imageUrl && (
              <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                <img
                  src={selectedPost.imageUrl}
                  alt="Trend"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
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

              <div style={{ display: 'flex', gap: '2rem', color: '#888', marginBottom: '2rem', alignItems: 'center' }}>
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

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
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
