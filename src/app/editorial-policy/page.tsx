export const metadata = {
    title: 'Editorial Policy | CricTrend',
    description: 'Learn about CricTrend\'s editorial standards, fact-checking process, and commitment to integrity.',
};

export default function EditorialPolicy() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Editorial Policy</h1>
            <div className="article-body">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Commitment to Truth and Accuracy</h2>
                <p>At CricTrend, we believe that accuracy is the bedrock of sports journalism. Our goal is to provide our readers with the most reliable cricket news and analysis available. Every piece of content we publish undergoes a thorough verification process to ensure its factual integrity.</p>

                <h2>2. Sourcing and Fact-Checking</h2>
                <p>We prioritize information from primary sources, including:</p>
                <ul>
                    <li>Official statements from cricket boards (BCCI, ICC, CA, etc.)</li>
                    <li>Verified social media accounts of players and teams</li>
                    <li>On-the-ground reporting from accredited journalists</li>
                    <li>Official match scorecards and data providers</li>
                </ul>
                <p>When using anonymous sources, we exercise extreme caution and require corroboration from at least two independent sources before publication. We never publish rumors or speculation as established fact.</p>

                <h2>3. Editorial Independence</h2>
                <p>CricTrend maintains total editorial independence. Our coverage is not influenced by advertisers, sponsors, or external stakeholders. Our primary loyalty is to our readers and to the truth of the game.</p>

                <h2>4. Corrections Policy</h2>
                <p>Despite our best efforts, errors may occasionally occur. When they do, we are committed to correcting them promptly and transparently. If you believe you have found an error in our reporting, please contact us at <a href="mailto:corrections@crictrend.com">corrections@crictrend.com</a>.</p>

                <h2>5. AI Usage Disclosure</h2>
                <p>CricTrend utilizes advanced technology and automated systems to provide real-time scores and data-driven insights. While we use AI to assist in data processing and initial content structuring, all major news stories and analytical pieces are reviewed and edited by our human editorial team to ensure quality, context, and a human touch.</p>

                <h2>6. Originality and Plagiarism</h2>
                <p>We have a zero-tolerance policy for plagiarism. All content published on CricTrend must be original. When we reference the work of other journalists or outlets, we provide clear and visible credit.</p>

                <h2>7. Fairness and Objectivity</h2>
                <p>We strive to provide balanced coverage of teams and players from all over the world. Our objective is to report on the game as it happens, without bias or favoritism.</p>
            </div>
        </div>
    );
}
