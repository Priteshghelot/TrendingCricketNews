export const metadata = {
    title: 'About Us | CricTrend',
    description: 'About CricTrend - Your Source for Cricket News',
};

export default function About() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">About Us</h1>
            <div className="article-body">
                <p>Welcome to <strong>CricTrend</strong>, your number one source for all things Cricket. We're dedicated to giving you the very best of cricket news, live scores, and match analysis.</p>

                <h2>Our Mission</h2>
                <p>Our mission is to provide accurate, real-time, and engaging cricket content to fans around the world. Whether it's the IPL, World Cup, or bilateral series, we cover it all with passion and precision.</p>

                <h2>Why Choose Us?</h2>
                <ul>
                    <li>Real-time Live Scores</li>
                    <li>In-depth Match Analysis</li>
                    <li>Latest News & Updates</li>
                    <li>Player Stats & Records</li>
                </ul>

                <h2>Contact</h2>
                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please just contact us.</p>
            </div>
        </div>
    );
}
