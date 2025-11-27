'use client';

import AnalyticsViewer from '@/components/AnalyticsViewer';
import Link from 'next/link';

export default function AnalyticsPage() {
    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link
                    href="/admin"
                    style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}
                >
                    ← Back to Admin
                </Link>
                <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>Analytics Dashboard</h1>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                    View your website visitor statistics and performance metrics
                </p>
            </div>

            <AnalyticsViewer />
        </div>
    );
}
