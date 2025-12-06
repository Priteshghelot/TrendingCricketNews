'use client';

import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        window.open(whatsappUrl, '_blank');
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="share-buttons" style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            padding: '1rem 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee',
            margin: '1.5rem 0'
        }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>Share:</span>

            <button
                onClick={shareOnTwitter}
                style={{
                    background: '#1DA1F2',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                𝕏 Twitter
            </button>

            <button
                onClick={shareOnFacebook}
                style={{
                    background: '#1877F2',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                }}
            >
                Facebook
            </button>

            <button
                onClick={shareOnWhatsApp}
                style={{
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                }}
            >
                WhatsApp
            </button>

            <button
                onClick={copyLink}
                style={{
                    background: copied ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'background 0.2s'
                }}
            >
                {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
        </div>
    );
}
