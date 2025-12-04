'use client';

import { useState, useEffect } from 'react';

interface Post {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    status: 'pending' | 'approved';
    timestamp: number;
}

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setMessage('Title and body are required');
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
                setMessage('Post created successfully!');
                fetchPosts();
            } else {
                setMessage('Failed to create post');
            }
        } catch (error) {
            setMessage('Error creating post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;

        try {
            await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'approved' }),
            });
            fetchPosts();
        } catch (error) {
            console.error('Error approving post:', error);
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">📝 Admin Panel</h1>
            </header>

            {/* Create Post Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label className="form-label">Title</label>
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
                    <label className="form-label">Body</label>
                    <textarea
                        className="form-textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write the full article..."
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : '✅ Create Post'}
                </button>

                {message && (
                    <p style={{ marginTop: '1rem', color: message.includes('success') ? 'var(--accent)' : 'var(--danger)' }}>
                        {message}
                    </p>
                )}
            </form>

            {/* Posts List */}
            <h2 style={{ marginBottom: '1rem' }}>All Posts ({posts.length})</h2>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="empty-state">No posts yet</div>
            ) : (
                <div className="posts-list">
                    {posts.map((post) => (
                        <div key={post.id} className="post-item">
                            <div style={{ flex: 1 }}>
                                <p className="post-item-title">{post.title}</p>
                                <small style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(post.timestamp).toLocaleDateString()}
                                </small>
                            </div>
                            <span className={`post-item-status status-${post.status}`}>
                                {post.status}
                            </span>
                            {post.status === 'pending' && (
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    onClick={() => handleApprove(post.id)}
                                >
                                    Approve
                                </button>
                            )}
                            <button
                                className="btn btn-danger"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                onClick={() => handleDelete(post.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
