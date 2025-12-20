export const metadata = {
    title: 'About Us | CricTrend',
    description: 'Learn about CricTrend, our mission, our editorial standards, and why we are your trusted source for cricket news.',
};

export default function About() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">About CricTrend</h1>
            <div className="article-body">
                <p>Welcome to <strong>CricTrend</strong>, a premier digital destination for cricket enthusiasts worldwide. Established in 2024, our platform was born out of a deep-seated passion for the "Gentleman's Game" and a commitment to providing fans with a reliable, insightful, and real-time source of cricket information.</p>

                <h2>Our Mission</h2>
                <p>Our mission is to provide accurate, real-time, and engaging cricket content to fans around the world. We strive to bridge the gap between the stadium and the screen, delivering ball-by-ball updates, expert analysis, and breaking news that keeps you ahead of the game. Whether it's the IPL, World Cup, or bilateral series, we cover it all with passion and precision.</p>

                <h2>Why Choose CricTrend?</h2>
                <ul>
                    <li><strong>Real-time Accuracy:</strong> Our automated scoring systems ensure you never miss a moment of the action.</li>
                    <li><strong>In-depth Analysis:</strong> Our editorial team goes beyond the numbers to provide context and insight into match dynamics.</li>
                    <li><strong>Comprehensive Coverage:</strong> From international Test matches to domestic T20 leagues, if there's a wicket, we're on it.</li>
                    <li><strong>Community Focused:</strong> We believe cricket is more than just a sport; it's a shared experience. We encourage interaction and feedback from our global community.</li>
                </ul>

                <h2>Our Editorial Standards</h2>
                <p>Trust is the foundation of our relationship with our readers. Every article on CricTrend undergoes a rigorous fact-checking process. We source our information from official cricket boards, verified news agencies, and on-the-ground journalists to ensure that what you read is not only interesting but fundamentally true. We adhere to the highest standards of journalistic integrity and transparency.</p>

                <h2>Our Team</h2>
                <p>CricTrend is powered by a diverse group of developers, data analysts, and cricket aficionados. We combine cutting-edge technology with traditional sports journalism to create a unique and immersive experience for our users. Our team is dedicated to continuous improvement, constantly refining our algorithms and expanding our coverage to meet the needs of the modern cricket fan.</p>

                <h2>Contact Us</h2>
                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, or if you're interested in joining our team, please visit our <a href="/contact">Contact Page</a>.</p>
            </div>
        </div>
    );
}
