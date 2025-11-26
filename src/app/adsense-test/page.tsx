'use client';

import { useEffect, useState } from 'react';

export default function AdSenseTest() {
    const [adSenseLoaded, setAdSenseLoaded] = useState(false);
    const [adSenseStatus, setAdSenseStatus] = useState('Checking...');

    useEffect(() => {
        // Check if AdSense script is loaded
        const checkAdSense = () => {
            if (typeof window !== 'undefined') {
                if ((window as any).adsbygoogle) {
                    setAdSenseLoaded(true);
                    setAdSenseStatus('✅ AdSense script is loaded correctly!');
                } else {
                    setAdSenseLoaded(false);
                    setAdSenseStatus('❌ AdSense script not found. Check your layout.tsx');
                }
            }
        };

        // Check immediately and after a delay
        checkAdSense();
        setTimeout(checkAdSense, 2000);
    }, []);

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>AdSense Diagnostic</h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Status:</h2>
                    <p style={{ fontSize: '1.1rem', padding: '1rem', background: adSenseLoaded ? '#10b981' : '#ef4444', borderRadius: '8px' }}>
                        {adSenseStatus}
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your AdSense Publisher ID:</h2>
                    <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                        ca-pub-3583801342408600
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fbbf24' }}>⚠️ Important:</h2>
                    <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                        <p style={{ marginBottom: '1rem' }}>Your ad slots are currently using <strong>placeholder IDs</strong>:</p>
                        <ul style={{ paddingLeft: '2rem', lineHeight: '1.8' }}>
                            <li><code>adSlot="1234567890"</code> ← Not a real ad unit</li>
                            <li><code>adSlot="0987654321"</code> ← Not a real ad unit</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            <strong>This is why ads aren't showing!</strong> You need to create real ad units in your AdSense account.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📝 How to Fix:</h2>
                    <ol style={{ paddingLeft: '2rem', lineHeight: '2' }}>
                        <li>Go to <a href="https://adsense.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>adsense.google.com</a></li>
                        <li>Click <strong>"Ads"</strong> → <strong>"By ad unit"</strong></li>
                        <li>Click <strong>"+ New ad unit"</strong></li>
                        <li>Choose <strong>"Display ads"</strong></li>
                        <li>Create ad units and copy the <code>data-ad-slot</code> numbers</li>
                        <li>Replace the placeholder IDs in your code with real ones</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
