'use client';

import { useState, useEffect } from 'react';
import AdSense from '@/components/AdSense';

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

export default function ArchivePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?status=archived');
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
            <header style={{ textAlign: 'center', margin: '4rem 0' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Archive</h1>
                <p style={{ color: '#888' }}>Yesterday's news.</p>
            </header>

            {/* Top Banner Ad */}
            <div style={{ maxWidth: '970px', margin: '0 auto 2rem' }}>
                <AdSense
                    adSlot="2222222222"
                    adFormat="horizontal"
                    style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}
                />
            </div>



            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading archive...</div>
            ) : posts.filter(p => Date.now() - p.timestamp >= 24 * 60 * 60 * 1000).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <p>The archive is empty.</p>
                </div>
            ) : (
                <div className="grid">
                    {posts
                        .filter(post => Date.now() - post.timestamp >= 24 * 60 * 60 * 1000) // Filter >= 24 hours
                        .map((post, index) => (
                            <a
                                key={post.id}
                                href={post.sourceUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit', opacity: 0.8 }}
                            >
                                {post.imageUrl && (
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={post.imageUrl}
                                            alt="Trend"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }}
                                            className="post-image"
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>{post.content}</p>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {new Date(post.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </a>
                        ))}
                </div>
            )}
        </div>
    );
}
