export const metadata = {
    title: 'Terms & Conditions | CricTrend',
    description: 'Terms and Conditions for using CricTrend',
};

export default function Terms() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Terms & Conditions</h1>
            <div className="article-body">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Agreement to Terms</h2>
                <p>By accessing our website at CricTrend, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on CricTrend's website for personal, non-commercial transitory viewing only.</p>

                <h2>3. Disclaimer</h2>
                <p>The materials on CricTrend's website are provided on an 'as is' basis. CricTrend makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                <h2>4. Accuracy of Materials</h2>
                <p>The materials appearing on CricTrend's website could include technical, typographical, or photographic errors. CricTrend does not warrant that any of the materials on its website are accurate, complete or current.</p>

                <h2>5. Links</h2>
                <p>CricTrend has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CricTrend of the site.</p>
            </div>
        </div>
    );
}
