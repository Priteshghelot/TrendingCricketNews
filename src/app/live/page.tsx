import LiveDashboard from '@/components/LiveDashboard';
import AdSense from '@/components/AdSense';

export const metadata = {
    title: 'Live Cricket Scores Dashboard | CricTrend',
    description: 'Real-time live cricket scores, trending matches, and upcoming fixtures.',
};

export default function LivePage() {
    return (
        <div className="main-layout container">
            <div style={{ gridColumn: '1 / -1' }}>
                {/* Top Ad */}
                <div className="ad-container">
                    <AdSense adSlot="1234567890" adFormat="horizontal" />
                </div>

                <h1 className="article-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Live Cricket Dashboard
                </h1>

                <LiveDashboard />

                {/* Bottom Ad */}
                <div className="ad-container">
                    <AdSense adSlot="5566778899" adFormat="auto" />
                </div>
            </div>
        </div>
    );
}
