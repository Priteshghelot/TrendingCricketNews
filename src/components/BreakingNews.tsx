'use client';

import React from 'react';

interface BreakingNewsProps {
    posts: { id: string; content: string }[];
}

export default function BreakingNews({ posts }: BreakingNewsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="breaking-news-container">
            <div className="breaking-label">
                <span className="blink">🔴</span> BREAKING NEWS
            </div>
            <div className="marquee-wrapper">
                <div className="marquee-content">
                    {posts.map((post) => (
                        <span key={post.id} className="marquee-item">
                            {post.content} •
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {posts.map((post) => (
                        <span key={`dup-${post.id}`} className="marquee-item">
                            {post.content} •
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
