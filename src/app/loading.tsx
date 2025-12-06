export default function Loading() {
    return (
        <div className="container main-layout">
            <div className="news-feed">
                {/* Skeleton Hero */}
                <div style={{ aspectRatio: '16/9', background: '#e0e0e0', borderRadius: '16px', marginBottom: '2rem' }} className="animate-pulse" />

                {/* Skeleton List */}
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ height: '160px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #eee' }} className="animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Skeleton Sidebar */}
            <div className="sidebar">
                <div style={{ height: '300px', background: '#f5f5f5', borderRadius: '8px' }} className="animate-pulse" />
            </div>
        </div>
    );
}
