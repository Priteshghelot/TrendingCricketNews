import React from 'react';

export const metadata = {
    title: 'Contact Us | CricTrend',
    description: 'Contact CricTrend for queries, feedback, or advertising opportunities.',
};

export default function ContactPage() {
    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>Contact Us</h1>

            <div style={{ lineHeight: '1.8', color: '#e2e8f0' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    We value your feedback and inquiries. If you have any questions about our content, suggestions for improvement,
                    or would like to report an issue, please don't hesitate to reach out to us.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>Get in Touch</h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Email</h3>
                        <p>
                            For general inquiries: <a href="mailto:contact@crictrend.vercel.app" style={{ color: 'white', textDecoration: 'underline' }}>contact@crictrend.vercel.app</a>
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Advertising</h3>
                        <p>
                            Interested in advertising on CricTrend? Email us at <a href="mailto:ads@crictrend.vercel.app" style={{ color: 'white', textDecoration: 'underline' }}>ads@crictrend.vercel.app</a>
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Social Media</h3>
                        <p>
                            Follow us on Twitter: <a href="https://twitter.com/crictrend" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>@crictrend</a>
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Response Time</h2>
                    <p>
                        We aim to respond to all inquiries within 24-48 hours. Please note that during major cricket events,
                        response times may be slightly longer due to high volume.
                    </p>
                </div>
            </div>
        </div>
    );
}
