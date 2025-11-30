import React from 'react';

export const metadata = {
    title: 'About Us | CricTrend',
    description: 'Learn about CricTrend, your ultimate destination for cricket news and live scores.',
};

export default function AboutPage() {
    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>About Us</h1>

            <div style={{ lineHeight: '1.8', color: '#e2e8f0' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'white' }}>
                    Welcome to <strong>CricTrend</strong>, your number one source for all things Cricket. We're dedicated to providing you the very best of cricket news,
                    live scores, and match analysis, with an emphasis on speed, accuracy, and comprehensive coverage.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Our Mission</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Founded in 2024, CricTrend has come a long way from its beginnings. When we first started out, our passion for
                    "Cricket for Everyone" drove us to start this news portal. We believe that every cricket fan deserves real-time
                    updates without the clutter.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Our mission is to connect cricket fans globally with the game they love. Whether it's the IPL, World Cup,
                    Test Cricket, or domestic leagues, we strive to bring you the latest updates as they happen.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>What We Offer</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '2rem', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Live Scores:</strong> Real-time ball-by-ball updates for all major matches.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Breaking News:</strong> Fastest reporting on team announcements, injuries, and match results.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>In-Depth Analysis:</strong> Expert takes on match performances and player statistics.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Global Coverage:</strong> From India to Australia, England to South Africa, we cover it all.</li>
                </ul>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Our Team</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    We are a team of passionate cricket enthusiasts, developers, and writers working round the clock to keep you updated.
                    We hope you enjoy our products as much as we enjoy offering them to you.
                </p>

                <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
                    Sincerely,<br />
                    <strong>The CricTrend Team</strong>
                </p>
            </div>
        </div>
    );
}
