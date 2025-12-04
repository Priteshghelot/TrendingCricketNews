'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    status: 'pending' | 'approved';
    timestamp: number;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    // Check authentication on mount
    useEffect(() => {
        const auth = localStorage.getItem('crictrend_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        } else {
            router.push('/login');
        }
        setCheckingAuth(false);
    }, [router]);

    // Fetch posts when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('crictrend_auth');
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setMessage('❌ Title and body are required');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body, imageUrl, status: 'approved' }),
            });

            if (res.ok) {
                setTitle('');
                setBody('');
                setImageUrl('');
                setMessage('✅ Post published successfully!');
                fetchPosts();
            } else {
                setMessage('❌ Failed to create post');
            }
        } catch (error) {
            setMessage('❌ Error creating post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;

        try {
            await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
            setMessage('🗑️ Post deleted');
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div className="loading" style={{ minHeight: '80vh' }}>
                Checking authentication...
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-container">
            {/* Header with Logout */}
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="admin-title">📰 News Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
                    Logout
                </button>
            </header>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                        {posts.length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Posts</p>
                </div>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                        {posts.filter(p => p.status === 'approved').length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Published</p>
                </div>
            </div>

            {/* Create Post Form */}
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
            }}>
                <h2 style={{ marginBottom: '1rem' }}>✍️ Create New Post</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Headline *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter news headline..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL (optional)</label>
                        <input
                            type="url"
                            className="form-input"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Article Body *</label>
                        <textarea
                            className="form-textarea"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write the full article content..."
                            style={{ minHeight: '200px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Publishing...' : '🚀 Publish Post'}
                    </button>

                    {message && (
                        <p style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: message.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.includes('✅') ? 'var(--accent)' : 'var(--danger)',
                        }}>
                            {message}
                        </p>
                    )}
                </form>
            </div>

            {/* Posts List */}
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
            }}>
                <h2 style={{ marginBottom: '1rem' }}>📋 All Posts ({posts.length})</h2>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">No posts yet. Create your first one above!</div>
                ) : (
                    <div className="posts-list">
                        {posts.map((post) => (
                            <div key={post.id} className="post-item">
                                <div style={{ flex: 1 }}>
                                    <p className="post-item-title">{post.title}</p>
                                    <small style={{ color: 'var(--text-secondary)' }}>
                                        {new Date(post.timestamp).toLocaleString()}
                                    </small>
                                </div>
                                <span className={`post-item-status status-${post.status}`}>
                                    {post.status}
                                </span>
                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    onClick={() => handleDelete(post.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
