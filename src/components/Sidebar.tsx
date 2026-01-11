import Link from 'next/link';
import AdSense from './AdSense';
import { getApprovedPosts } from '@/lib/store';
import SidebarLiveWidget from './SidebarLiveWidget';

export default async function Sidebar() {
    const posts = await getApprovedPosts();
    // Use first 5 posts as "Trending" for now
    const trendingPosts = posts.slice(0, 5);

    return (
        <aside className="sidebar">
            {/* Live Scores Widget */}
            <SidebarLiveWidget />

            {/* Trending Headlines */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Trending Headlines</h3>
                <ul className="trending-list">
                    {trendingPosts.length > 0 ? (
                        trendingPosts.map((post, index) => (
                            <li key={post.id} className="trending-item">
                                <span className="trending-rank">{index + 1}</span>
                                <Link href={`/news/${post.id}`} className="trending-link">
                                    {post.title}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li style={{ color: '#666', fontStyle: 'italic' }}>No trending news</li>
                    )}
                </ul>
            </div>

            {/* Sidebar Ad */}
            <div className="ad-container-sidebar">
                <AdSense adSlot="9876543210" adFormat="rectangle" />
            </div>

            {/* Quick Links */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Quick Links</h3>
                <div className="quick-links">
                    <Link href="/live" className="quick-link-tag">Live Scores</Link>
                    <Link href="/teams" className="quick-link-tag">Teams</Link>
                    <Link href="/" className="quick-link-tag">Schedule</Link>
                    <Link href="/" className="quick-link-tag">Points Table</Link>
                    <Link href="/" className="quick-link-tag">Rankings</Link>
                </div>
            </div>
        </aside>
    );
}
