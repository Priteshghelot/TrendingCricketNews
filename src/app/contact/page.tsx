export const metadata = {
    title: 'Contact Us | CricTrend',
    description: 'Get in touch with the CricTrend team for support, advertising, or editorial inquiries.',
};

export default function Contact() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Contact Us</h1>
            <div className="article-body">
                <p>We value your feedback and are here to help. Whether you have a question about a news story, a technical issue with the site, or a suggestion for how we can improve, please don't hesitate to reach out.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div>
                        <h2>Editorial & Support</h2>
                        <p>For questions regarding our content, reporting errors, or general support:</p>
                        <p><strong>Email:</strong> <a href="mailto:support@crictrend.com" style={{ color: 'var(--primary-blue)' }}>support@crictrend.com</a></p>
                        <p><strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours.</p>
                    </div>

                    <div>
                        <h2>Advertising & Partnerships</h2>
                        <p>For media kits, advertising opportunities, or business partnerships:</p>
                        <p><strong>Email:</strong> <a href="mailto:business@crictrend.com" style={{ color: 'var(--primary-blue)' }}>business@crictrend.com</a></p>
                        <p>Please include "Partnership Inquiry" in your subject line.</p>
                    </div>
                </div>

                <h2 style={{ marginTop: '2rem' }}>Stay Connected</h2>
                <p>Follow us on social media for the latest updates and real-time cricket conversation:</p>
                <p><strong>X (Twitter):</strong> <a href="https://twitter.com/crictrend" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>@crictrend</a></p>
                <p><strong>Facebook:</strong> <a href="https://facebook.com/crictrend" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>CricTrend Official</a></p>

                <h2 style={{ marginTop: '2rem' }}>Our Location</h2>
                <p>While our team operates globally, our primary administrative operations are based in:</p>
                <p>
                    <strong>CricTrend Media Group</strong><br />
                    Pune, Maharashtra<br />
                    India
                </p>

                <h2 style={{ marginTop: '2rem' }}>Report a Correction</h2>
                <p>Accuracy is our priority. If you believe we have published an error, please email <a href="mailto:corrections@crictrend.com" style={{ color: 'var(--primary-blue)' }}>corrections@crictrend.com</a> with the URL of the article and a description of the error. We take all reports seriously and will investigate and correct verified errors promptly.</p>
            </div>
        </div>
    );
}
