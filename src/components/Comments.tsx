'use client';

import { useState, useEffect } from 'react';

interface Comment {
    id: string;
    postId: string;
    author: string;
    text: string;
    timestamp: number;
}

export default function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?postId=${postId}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    console.error('Comments API returned non-array:', data);
                    setComments([]);
                }
            }
        } catch (err) {
            console.error('Failed to fetch comments', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, author: author || 'Fan', text }),
            });

            if (!res.ok) throw new Error('Failed to post comment');

            const newComment = await res.json();
            setComments([newComment, ...comments]);
            setText('');
        } catch (err) {
            setError('Failed to post comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            marginTop: '3rem',
            padding: '2rem 0',
            borderTop: '1px solid var(--border)'
        }}>
            <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                💬 Fan Chat
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            fontSize: '0.9rem',
                            maxWidth: '300px'
                        }}
                    />
                    <textarea
                        placeholder="What do you think about this?..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        required
                    />
                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'var(--primary-blue)',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 1.5rem',
                                borderRadius: '999px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? 'Posting...' : 'Post Comment 🚀'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                        Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} style={{
                            background: 'var(--bg-secondary)',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderBottomLeftRadius: '2px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                            }}>
                                <span style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>
                                    {comment.author}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                {comment.text}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
