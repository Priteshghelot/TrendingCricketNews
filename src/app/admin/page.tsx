'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem('crictrend_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        } else {
            router.push('/login');
        }
        setCheckingAuth(false);
    }, [router]);

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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            setMessage('❌ Image too large. Please use an image under 1MB or paste a URL.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImageUrl(base64String);
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
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
                setImagePreview('');
                setMessage('✅ Post published successfully!');
                fetchPosts();
            } else {
                const error = await res.json();
                setMessage('❌ Failed to create post. Make sure Vercel KV is connected!');
            }
        } catch (error) {
            setMessage('❌ Error: Database not connected. Connect Vercel KV in your dashboard.');
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

    if (checkingAuth) {
        return (
            <div className="loading" style={{ minHeight: '80vh' }}>
                Checking authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #03a9f4 0%, #0288d1 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        📰 CricTrend Admin
                    </h1>
                    <p style={{ opacity: 0.9 }}>Publish cricket news to your website</p>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#03a9f4', marginBottom: '0.5rem' }}>
                        {posts.length}
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Articles</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4caf50', marginBottom: '0.5rem' }}>
                        {posts.filter(p => p.status === 'approved').length}
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Published</p>
                </div>
            </div>

            {/* Create Post Form */}
            <div style={{
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                    ✍️ Create New Article
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Headline *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter cricket news headline..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Featured Image</label>
                        <div style={{
                            border: '2px dashed #e5e5e5',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            background: '#f9f9f9'
                        }}>
                            {imagePreview ? (
                                <div>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageUrl('');
                                            setImagePreview('');
                                        }}
                                        style={{
                                            background: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ marginBottom: '1rem', color: '#666' }}>
                                        📸 Upload image or paste URL
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                        id="imageUpload"
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        style={{
                                            background: '#03a9f4',
                                            color: 'white',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'inline-block',
                                            marginRight: '1rem'
                                        }}
                                    >
                                        Choose File
                                    </label>
                                    <span style={{ color: '#999' }}>or</span>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={imageUrl}
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            setImagePreview(e.target.value);
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        style={{ marginTop: '1rem' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Article Content *</label>
                        <textarea
                            className="form-textarea"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your cricket news article..."
                            style={{ minHeight: '250px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            background: '#4caf50',
                            fontWeight: '700'
                        }}
                    >
                        {submitting ? '🔄 Publishing...' : '🚀 Publish Article'}
                    </button>

                    {message && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '8px',
                            background: message.includes('✅') ? '#e8f5e9' : '#ffebee',
                            color: message.includes('✅') ? '#2e7d32' : '#c62828',
                            fontWeight: '500'
                        }}>
                            {message}
                        </div>
                    )}
                </form>
            </div>

            {/* Posts List */}
            <div style={{
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '2rem'
            }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                    📋 All Articles ({posts.length})
                </h2>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">
                        <p>No articles yet. Create your first one above!</p>
                    </div>
                ) : (
                    <div className="posts-list">
                        {posts.map((post) => (
                            <div key={post.id} className="post-item">
                                <div style={{ flex: 1 }}>
                                    <p className="post-item-title">{post.title}</p>
                                    <small style={{ color: '#666' }}>
                                        {new Date(post.timestamp).toLocaleString()}
                                    </small>
                                </div>
                                <span className={`post-item-status status-${post.status}`}>
                                    {post.status}
                                </span>
                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '0.5rem 1rem' }}
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
