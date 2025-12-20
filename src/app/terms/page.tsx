export const metadata = {
    title: 'Terms & Conditions | CricTrend',
    description: 'Terms and Conditions for using CricTrend - Please read our terms of service carefully.',
};

export default function Terms() {
    return (
        <div className="container article" style={{ marginTop: '2rem' }}>
            <h1 className="article-title">Terms & Conditions</h1>
            <div className="article-body">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Agreement to Terms</h2>
                <p>By accessing or using CricTrend (the "Site"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, do not use the Site.</p>

                <h2>2. Intellectual Property Rights</h2>
                <p>Unless otherwise stated, CricTrend and/or its licensors own the intellectual property rights for all material on CricTrend. All intellectual property rights are reserved. You may access this from CricTrend for your own personal use subjected to restrictions set in these terms and conditions.</p>
                <p>You must not:</p>
                <ul>
                    <li>Republish material from CricTrend</li>
                    <li>Sell, rent or sub-license material from CricTrend</li>
                    <li>Reproduce, duplicate or copy material from CricTrend</li>
                    <li>Redistribute content from CricTrend</li>
                </ul>

                <h2>3. User Content</h2>
                <p>In these terms and conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Site (e.g., in the comments section). By displaying Your Content, you grant CricTrend a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
                <p>Your Content must be your own and must not be invading any third-party's rights. CricTrend reserves the right to remove any of Your Content from this Site at any time without notice.</p>

                <h2>4. No Warranties</h2>
                <p>This Site is provided "as is," with all faults, and CricTrend expresses no representations or warranties, of any kind related to this Site or the materials contained on this Site. Also, nothing contained on this Site shall be interpreted as advising you.</p>

                <h2>5. Limitation of Liability</h2>
                <p>In no event shall CricTrend, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Site whether such liability is under contract. CricTrend, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Site.</p>

                <h2>6. Indemnification</h2>
                <p>You hereby indemnify to the fullest extent CricTrend from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

                <h2>7. Severability</h2>
                <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

                <h2>8. Variation of Terms</h2>
                <p>CricTrend is permitted to revise these Terms at any time as it sees fit, and by using this Site you are expected to review these Terms on a regular basis.</p>

                <h2>9. Governing Law & Jurisdiction</h2>
                <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
            </div>
        </div>
    );
}
