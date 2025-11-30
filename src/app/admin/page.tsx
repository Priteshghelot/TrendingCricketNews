'use client';

import { useState, useEffect } from 'react';
import AnalyticsViewer from '@/components/AnalyticsViewer';

interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
    highlights?: string;
    body?: string;
}

interface EditState {
    id: string;
    content: string;
    highlights: string;
    body: string;
    imageUrl: string;
}

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<EditState | null>(null);
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
            // If approving, send the current edited state if it matches the ID
            const updates = editingPost && editingPost.id === id ? {
                content: editingPost.content,
                highlights: editingPost.highlights,
                body: editingPost.body,
                imageUrl: editingPost.imageUrl
            } : {};

            await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, ...updates }),
            });

            // Remove from local state and clear edit mode
            setPosts(posts.filter(p => p.id !== id));
            if (editingPost?.id === id) setEditingPost(null);
        } catch (error) {
            console.error('Failed to update post', error);
        }
    };

    const startEditing = (post: Post) => {
        setEditingPost({
            id: post.id,
            content: post.content,
            highlights: post.highlights || '',
            body: post.body || '',
            imageUrl: post.imageUrl || ''
        });
        // Scroll to top or modal
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <AnalyticsViewer />

            <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
                <button
                    onClick={() => {
                        setEditingPost({
                            id: '', // Empty ID signals new post
                            content: '',
                            highlights: '',
                            body: '',
                            imageUrl: ''
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn"
                    style={{ background: '#10b981', color: 'white', padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}
                >
                    ➕ Create New Article
                </button>
            </div>

            {editingPost && (
                <div className="card" style={{ padding: '2rem', marginBottom: '3rem', border: '2px solid var(--primary)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        {editingPost.id ? '✏️ Editing Post' : '📝 Create New Article'}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Headline</label>
                            <input
                                value={editingPost.content}
                                onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setEditingPost({ ...editingPost, imageUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    style={{ color: 'white' }}
                                />
                                <span style={{ color: '#888' }}>OR</span>
                            </div>
                            <input
                                placeholder="Paste Image URL"
                                value={editingPost.imageUrl}
                                onChange={e => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}
                            />
                            {editingPost.imageUrl && (
                                <div style={{ marginTop: '1rem', width: '200px', height: '120px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #334155' }}>
                                    <img src={editingPost.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Article Body (Original Content)</label>
                            <textarea
                                value={editingPost.body}
                                onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                                style={{ width: '100%', height: '300px', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px', fontFamily: 'monospace' }}
                                placeholder="Write your original article here..."
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={async () => {
                                    if (!editingPost.id) {
                                        // Create New
                                        try {
                                            await fetch('/api/posts', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    content: editingPost.content,
                                                    highlights: editingPost.highlights,
                                                    body: editingPost.body,
                                                    imageUrl: editingPost.imageUrl,
                                                    status: 'approved'
                                                }),
                                            });
                                            fetchPosts();
                                            setEditingPost(null);
                                        } catch (e) {
                                            console.error(e);
                                            alert('Failed to create post');
                                        }
                                    } else {
                                        // Update Existing
                                        handleAction(editingPost.id, 'approved');
                                    }
                                }}
                                className="btn btn-success"
                                style={{ flex: 1 }}
                            >
                                {editingPost.id ? '✅ Save & Approve' : '🚀 Publish Now'}
                            </button>
                            <button
                                onClick={() => setEditingPost(null)}
                                className="btn"
                                style={{ flex: 1, background: '#64748b' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div >
            )}

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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <h1>Pending News</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a
                        href="/admin/analytics"
                        className="btn"
                        style={{ background: '#8b5cf6', color: 'white' }}
                    >
                        📊 View Analytics
                    </a>
                    <button
                        onClick={async () => {
                            if (confirm('Clean up posts older than 30 days?')) {
                                const res = await fetch('/api/cleanup', { method: 'POST' });
                                const data = await res.json();
                                alert(`${data.message}\nRemaining posts: ${data.remainingPosts}`);
                                fetchPosts();
                            }
                        }}
                        className="btn"
                        style={{ background: '#f59e0b', color: 'white' }}
                    >
                        🧹 Cleanup Old Posts
                    </button>
                    <button onClick={fetchNewTrends} className="btn btn-primary">
                        Fetch Cricket News (RSS)
                    </button>
                </div>
            </div>

            {
                loading ? (
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
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <button
                                            onClick={() => startEditing(post)}
                                            className="btn"
                                            style={{ flex: 1, background: '#3b82f6' }}
                                        >
                                            ✏️ Edit & Rewrite
                                        </button>
                                    </div>
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
                                    value={editingPost.imageUrl}
                                    onChange={e => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}
                            />
                                    {editingPost.imageUrl && (
                                        <div style={{ marginTop: '1rem', width: '200px', height: '120px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #334155' }}>
                                            <img src={editingPost.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Article Body (Original Content)</label>
                                    <textarea
                                        value={editingPost.body}
                                        onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
                                        style={{ width: '100%', height: '300px', padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px', fontFamily: 'monospace' }}
                                        placeholder="Write your original article here..."
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={async () => {
                                            if (!editingPost.id) {
                                                // Create New
                                                try {
                                                    await fetch('/api/posts', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            content: editingPost.content,
                                                            highlights: editingPost.highlights,
                                                            body: editingPost.body,
                                                            imageUrl: editingPost.imageUrl,
                                                            status: 'approved'
                                                        }),
                                                    });
                                                    fetchPosts();
                                                    setEditingPost(null);
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('Failed to create post');
                                                }
                                            } else {
                                                // Update Existing
                                                handleAction(editingPost.id, 'approved');
                                            }
                                        }}
                                        className="btn btn-success"
                                        style={{ flex: 1 }}
                                    >
                                        {editingPost.id ? '✅ Save & Approve' : '🚀 Publish Now'}
                                    </button>
                                    <button
                                        onClick={() => setEditingPost(null)}
                                        className="btn"
                                        style={{ flex: 1, background: '#64748b' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                </div >
                )}

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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <h1>Pending News</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a
                        href="/admin/analytics"
                        className="btn"
                        style={{ background: '#8b5cf6', color: 'white' }}
                    >
                        📊 View Analytics
                    </a>
                    <button
                        onClick={async () => {
                            if (confirm('Clean up posts older than 30 days?')) {
                                const res = await fetch('/api/cleanup', { method: 'POST' });
                                const data = await res.json();
                                alert(`${data.message}\nRemaining posts: ${data.remainingPosts}`);
                                fetchPosts();
                            }
                        }}
                        className="btn"
                        style={{ background: '#f59e0b', color: 'white' }}
                    >
                        🧹 Cleanup Old Posts
                    </button>
                    <button onClick={fetchNewTrends} className="btn btn-primary">
                        Fetch Cricket News (RSS)
                    </button>
                </div>
            </div>

            {
                loading ? (
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
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <button
                                            onClick={() => startEditing(post)}
                                            className="btn"
                                            style={{ flex: 1, background: '#3b82f6' }}
                                        >
                                            ✏️ Edit & Rewrite
                                        </button>
                                    </div>
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
                )
            }
        </div >
    );
}
