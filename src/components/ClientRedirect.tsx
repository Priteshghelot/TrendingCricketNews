'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ url }: { url: string }) {
    const router = useRouter();

    useEffect(() => {
        // Use window.location for a hard redirect to ensure fresh state on the destination
        window.location.href = url;
    }, [url, router]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            color: '#cbd5e1',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
            }} />
            <p>Redirecting to article...</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                <a href={url} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    Click here if not redirected
                </a>
            </p>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
