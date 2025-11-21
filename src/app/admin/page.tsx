'use client';

import { useState, useEffect } from 'react';

interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
}

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState({
        teamA: '', teamB: '', scoreA: '', scoreB: '', status: '', matchTitle: ''
    });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts?status=pending');
            const data = await res.json();
            setPosts(data.posts);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchScore = async () => {
        try {
            const res = await fetch('/api/scores');
            const data = await res.json();
            if (data && data.score) {
                setScore(data.score);
            }
        } catch (error) {
            console.error('Failed to fetch score', error);
        }
    };

    const updateScore = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(score),
            });
            alert('Score updated!');
        } catch (error) {
            console.error('Failed to update score', error);
        }
    };

    const fetchNewTrends = async () => {
        try {
            await fetch('/api/fetch-trends', { method: 'POST' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to fetch new trends', error);
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            // Remove from local state
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to update post', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await fetch(`/api/posts?id=${id}`, {
                method: 'DELETE',
            });
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchScore();
    }, []);

    return (
        <div className="container">
            <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Live Score Manager</h2>
                <form onSubmit={updateScore} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                        placeholder="Match Title (e.g. IND vs AUS)"
                        value={score?.matchTitle || ''}
                        onChange={e => setScore({ ...score, matchTitle: e.target.value })}
                        style={{ gridColumn: '1 / -1', padding: '0.5rem' }}
                    />
                    <input
                        placeholder="Team A"
                        value={score?.teamA || ''}
                        onChange={e => setScore({ ...score, teamA: e.target.value })}
                        style={{ padding: '0.5rem' }}
                    />
                    <input
                        placeholder="Team B"
                        value={score?.teamB || ''}
                        onChange={e => setScore({ ...score, teamB: e.target.value })}
                        style={{ padding: '0.5rem' }}
                    />
                    <input
                        placeholder="Score A"
                        value={score?.scoreA || ''}
                        onChange={e => setScore({ ...score, scoreA: e.target.value })}
                        style={{ padding: '0.5rem' }}
                    />
                    <input
                        placeholder="Score B"
                        value={score?.scoreB || ''}
                        onChange={e => setScore({ ...score, scoreB: e.target.value })}
                        style={{ padding: '0.5rem' }}
                    />
                    <input
                        placeholder="Status (e.g. Live)"
                        value={score?.status || ''}
                        onChange={e => setScore({ ...score, status: e.target.value })}
                        style={{ gridColumn: '1 / -1', padding: '0.5rem' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
                        Update Live Score
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Pending News</h1>
                <button onClick={fetchNewTrends} className="btn btn-primary">
                    Fetch Cricket News (RSS)
                </button>
            </div>

            {loading ? (
                <p>Loading pending posts...</p>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <p>No pending posts. Fetch some trends!</p>
                </div>
            ) : (
                <div className="grid">
                    {posts.map((post) => (
                        <div key={post.id} className="card animate-fade-in">
                            {post.imageUrl && (
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={post.imageUrl}
                                        alt="Trend"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{post.content}</p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleAction(post.id, 'approved')}
                                        className="btn btn-success"
                                        style={{ flex: 1 }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(post.id, 'rejected')}
                                        className="btn btn-danger"
                                        style={{ flex: 1 }}
                                    >
                                        Reject
                                    </button>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="btn btn-danger"
                                        style={{ width: '100%', background: '#ef4444' }}
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
