export const metadata = {
    title: 'Privacy Policy | CricTrend',
    description: 'Privacy Policy for CricTrend - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Privacy Policy</h1>
            <div className="article-body">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>Welcome to CricTrend. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

                <h2>2. The Data We Collect About You</h2>
                <p>Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).</p>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul>
                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                    <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                </ul>

                <h2>3. How We Collect Your Data</h2>
                <p>We use different methods to collect data from and about you including through:</p>
                <ul>
                    <li><strong>Direct interactions:</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
                    <li><strong>Automated technologies or interactions:</strong> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies.</li>
                    <li><strong>Third parties:</strong> We receive personal data about you from various third parties such as Google Analytics and Google AdSense.</li>
                </ul>

                <h2>4. Google AdSense & Cookies</h2>
                <p>This website uses Google AdSense, a service for including advertisements from Google Inc. ("Google").</p>
                <p>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</p>
                <p>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>

                <h2>5. Cookies and Web Beacons</h2>
                <p>CricTrend uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

                <h2>6. Your Legal Rights</h2>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>

                <h2>7. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact our privacy manager in the following ways:</p>
                <p><strong>Full name of legal entity:</strong> CricTrend Media Group</p>
                <p><strong>Email address:</strong> <a href="mailto:privacy@crictrend.com">privacy@crictrend.com</a></p>
            </div>
        </div>
    );
}
