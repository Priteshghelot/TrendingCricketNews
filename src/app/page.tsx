'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

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

    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Trigger refresh
          setIsAutoRefreshing(true);
          fetchPosts().then(() => {
            setTimeout(() => setIsAutoRefreshing(false), 1000); // Reset animation after 1s
          });
          return 10; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      await fetch('/api/cron/news');
      const res = await fetch('/api/posts?status=approved');
      const data = await res.json();
      setPosts(data.posts);
      setTimeLeft(10); // Reset timer on manual refresh
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts safely
  // Since posts is empty initially, Date.now() won't run on server, so this is safe.
  const recentPosts = posts.filter(post => Date.now() - post.timestamp < 24 * 60 * 60 * 1000);

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

        {/* Manual Refresh Button with Timer */}
        <button
          onClick={handleManualRefresh}
          className={`btn ${isAutoRefreshing ? 'pulse-animation' : ''}`}
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
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '1rem auto'
          }}
          disabled={loading}
        >
          {loading ? '🔄 Refreshing...' : (
            <>
              <span>🔄 Refresh News</span>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.8em'
              }}>
                {timeLeft}s
              </span>
            </>
          )}
        </button>
        <style jsx>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          .pulse-animation {
            animation: pulse-ring 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          }
        `}</style>
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
      ) : recentPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <p>No recent news. Check the archive for older stories.</p>
        </div>
      ) : (
        <div className="grid">
          {recentPosts
            .map((post, index) => (
              <React.Fragment key={post.id}>
                <Link
                  href={`/news/${post.id}`}
                  className="card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
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
                </Link>

                {/* In-Content Ad - Show after every 4 articles */}
                {(index + 1) % 4 === 0 && index !== recentPosts.length - 1 && (
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
    </div>
  );
}
