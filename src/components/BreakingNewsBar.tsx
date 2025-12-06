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
            boxShadow: 'var(--shadow-sm)'
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
                    boxShadow: '0 2px 4px rgba(211, 47, 47, 0.4)'
                }}>
                    <span style={{ fontSize: '1.2em' }}>⚡</span>
                    <span>Breaking News</span>
                </div>

                {/* Headline Marquee/Text */}
                <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <Link href={`/news/${latestPost.id}`} style={{
                        color: 'var(--text-primary)',
                        fontWeight: '500',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }} className="breaking-news-link">
                        <span style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>
                            {new Date(latestPost.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}:
                        </span>
                        {latestPost.title}
                    </Link>
                </div>
            </div>
        </div>
    );
}
