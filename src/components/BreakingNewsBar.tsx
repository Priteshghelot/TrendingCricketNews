import Link from 'next/link';
import { getApprovedPosts } from '@/lib/store';

export default async function BreakingNewsBar() {
    const posts = await getApprovedPosts();
    const latestPost = posts.length > 0 ? posts[0] : null;

    if (!latestPost) return null;

    return (
        <div style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 0',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Breaking News Badge */}
                <div style={{
                    background: 'var(--danger)',
                    color: 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '4px',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 4px rgba(211, 47, 47, 0.4)',
                    zIndex: 10,
                    position: 'relative'
                }}>
                    <span style={{ fontSize: '1.2em' }}>⚡</span>
                    <span>Breaking News</span>
                </div>

                {/* Headline Marquee */}
                <div className="marquee-container" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div className="marquee-content" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        <Link href={`/news/${latestPost.id}`} style={{
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }} className="breaking-news-link">
                            <span style={{
                                color: 'var(--primary-blue)',
                                fontWeight: '700',
                                fontSize: '0.9rem'
                            }}>
                                {new Date(latestPost.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}:
                            </span>
                            <span style={{
                                fontWeight: '900',
                                fontSize: '1.1rem',
                                color: '#000',
                                textDecoration: 'underline',
                                textDecorationColor: 'var(--accent-orange)',
                                textUnderlineOffset: '4px'
                            }}>
                                {latestPost.title}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
