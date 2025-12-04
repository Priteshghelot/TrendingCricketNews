import Link from 'next/link';
import AdSense from './AdSense';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            {/* Sidebar Ad */}
            <div className="sidebar-section">
                <div className="ad-container-sidebar">
                    <AdSense adSlot="8899001122" adFormat="rectangle" />
                </div>
            </div>

            {/* Trending Section */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Trending Now</h3>
                <ul className="trending-list">
                    <li className="trending-item">
                        <span className="trending-rank">1</span>
                        <Link href="#" className="trending-link">
                            Virat Kohli scores 50th ODI century
                        </Link>
                    </li>
                    <li className="trending-item">
                        <span className="trending-rank">2</span>
                        <Link href="#" className="trending-link">
                            IPL 2025 Auction: Full list of sold players
                        </Link>
                    </li>
                    <li className="trending-item">
                        <span className="trending-rank">3</span>
                        <Link href="#" className="trending-link">
                            Australia announces squad for T20 World Cup
                        </Link>
                    </li>
                    <li className="trending-item">
                        <span className="trending-rank">4</span>
                        <Link href="#" className="trending-link">
                            BCCI releases new central contract list
                        </Link>
                    </li>
                    <li className="trending-item">
                        <span className="trending-rank">5</span>
                        <Link href="#" className="trending-link">
                            Rohit Sharma on retirement rumors
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Quick Links */}
            <div className="sidebar-section">
                <h3 className="sidebar-title">Quick Links</h3>
                <div className="quick-links">
                    <Link href="#" className="quick-link-tag">T20 World Cup</Link>
                    <Link href="#" className="quick-link-tag">IPL 2025</Link>
                    <Link href="#" className="quick-link-tag">WTC Final</Link>
                    <Link href="#" className="quick-link-tag">Rankings</Link>
                </div>
            </div>
        </aside>
    );
}
