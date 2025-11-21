'use client';

import React from 'react';

interface BreakingNewsProps {
    posts: { id: string; content: string }[];
}

export default function BreakingNews({ posts }: BreakingNewsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="breaking-news-container" style={{
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '0.5rem 0'
        }}>
            <div className="breaking-label" style={{
                background: '#ef4444',
                padding: '0.5rem 1.5rem',
                fontSize: '1.2rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                paddingRight: '2rem'
            }}>
                <span className="blink" style={{ marginRight: '0.5rem' }}>🔴</span>
                BREAKING NEWS
            </div>
            <div className="marquee-wrapper" style={{ height: '3rem' }}>
                <div className="marquee-content" style={{ alignItems: 'center' }}>
                    {posts.map((post) => (
                        <span key={post.id} className="marquee-item" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                            {post.content} •
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {posts.map((post) => (
                        <span key={`dup-${post.id}`} className="marquee-item" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                            {post.content} •
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
