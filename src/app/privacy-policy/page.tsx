export const metadata = {
    title: 'Privacy Policy | CricTrend',
    description: 'Privacy Policy for CricTrend',
};

export default function PrivacyPolicy() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Privacy Policy</h1>
            <div className="article-body">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>Welcome to CricTrend. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>

                <h2>2. Information We Collect</h2>
                <p>We do not collect any personal data from you directly unless you contact us via email. We use third-party services like Google Analytics and Google AdSense which may collect data using cookies.</p>

                <h2>3. Cookies</h2>
                <p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p>
                <ul>
                    <li><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors engage with our site.</li>
                    <li><strong>Google AdSense:</strong> Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

                <h2>5. Contact Us</h2>
                <p>If you have any questions about this privacy policy, please contact us at: support@crictrend.com</p>
            </div>
        </div>
    );
}
