import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | CricTrend',
    description: 'Privacy Policy for CricTrend. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>Privacy Policy</h1>

            <div style={{ lineHeight: '1.8', color: '#e2e8f0' }}>
                <p style={{ marginBottom: '1.5rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <p style={{ marginBottom: '1.5rem' }}>
                    At CricTrend, accessible from https://crictrend.vercel.app, one of our main priorities is the privacy of our visitors.
                    This Privacy Policy document contains types of information that is collected and recorded by CricTrend and how we use it.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Log Files</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend follows a standard procedure of using log files. These files log visitors when they visit websites.
                    All hosting companies do this and a part of hosting services' analytics. The information collected by log files include
                    internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages,
                    and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                    The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website,
                    and gathering demographic information.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Google DoubleClick DART Cookie</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site
                    visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline
                    the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL –{' '}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                        https://policies.google.com/technologies/ads
                    </a>
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Privacy Policies</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of CricTrend.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their
                    respective advertisements and links that appear on CricTrend, which are sent directly to users' browser. They automatically
                    receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising
                    campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    Note that CricTrend has no access to or control over these cookies that are used by third-party advertisers.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Third Party Privacy Policies</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the
                    respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices
                    and instructions about how to opt-out of certain options.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    You can choose to disable cookies through your individual browser options. To know more detailed information about cookie
                    management with specific web browsers, it can be found at the browsers' respective websites.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Google Data Usage</h2>
                <p style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                    <strong>Important:</strong> We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.
                    Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
                    <br /><br />
                    Please review <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>How Google uses data when you use our partners’ sites or apps</a>.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Children's Information</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians
                    to observe, participate in, and/or monitor and guide their online activity.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think
                    that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and
                    we will do our best efforts to promptly remove such information from our records.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>Consent</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                </p>
            </div>
        </div>
    );
}
