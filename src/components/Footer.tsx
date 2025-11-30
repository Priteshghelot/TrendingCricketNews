import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: '#0f172a',
            borderTop: '1px solid #1e293b',
            padding: '3rem 0',
            marginTop: 'auto',
            color: '#94a3b8'
        }}>
            <div className="container" style={{ padding: '0 1.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1rem' }}>CricTrend</h3>
                        <p style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
                            Your ultimate destination for the fastest cricket news, live scores, and in-depth analysis.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/live" style={{ color: 'inherit', textDecoration: 'none' }}>Live Scores</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/archive" style={{ color: 'inherit', textDecoration: 'none' }}>News Archive</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>Legal & Info</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #1e293b',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} CricTrend. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
