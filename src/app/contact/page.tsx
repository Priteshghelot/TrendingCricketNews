export const metadata = {
    title: 'Contact Us | CricTrend',
    description: 'Contact CricTrend Support',
};

export default function Contact() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Contact Us</h1>
            <div className="article-body">
                <p>We would love to hear from you! Whether you have a question about a news story, a suggestion for our website, or just want to say hello, feel free to reach out.</p>

                <h2>Get in Touch</h2>
                <p><strong>Email:</strong> <a href="mailto:contact@crictrend.com" style={{ color: 'var(--primary-blue)' }}>contact@crictrend.com</a></p>
                <p><strong>Twitter:</strong> <a href="https://twitter.com/crictrend" target="_blank" style={{ color: 'var(--primary-blue)' }}>@crictrend</a></p>

                <h2>Advertising & Partnerships</h2>
                <p>For advertising inquiries or partnership opportunities, please email us with the subject line "Partnership".</p>

                <h2>Feedback</h2>
                <p>Your feedback helps us improve. If you spot an error or have technical issues, please let us know immediately.</p>
            </div>
        </div>
    );
}
