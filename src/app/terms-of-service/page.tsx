import React from 'react';

export const metadata = {
    title: 'Terms of Service | CricTrend',
    description: 'Terms and Conditions for using CricTrend.',
};

export default function TermsOfService() {
    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>Terms of Service</h1>

            <div style={{ lineHeight: '1.8', color: '#e2e8f0' }}>
                <p style={{ marginBottom: '1.5rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>1. Terms</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    By accessing this Website, accessible from https://crictrend.vercel.app, you are agreeing to be bound by these
                    Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
                    If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this
                    Website are protected by copyright and trade mark law.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>2. Use License</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Permission is granted to temporarily download one copy of the materials on CricTrend's Website for personal,
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '2rem', marginBottom: '1.5rem' }}>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose or for any public display;</li>
                    <li>attempt to reverse engineer any software contained on CricTrend's Website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
                <p style={{ marginBottom: '1.5rem' }}>
                    This will let CricTrend to terminate upon violations of any of these restrictions. Upon termination, your viewing right
                    will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or
                    electronic format.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>3. Disclaimer</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    All the materials on CricTrend's Website are provided "as is". CricTrend makes no warranties, may it be expressed or
                    implied, therefore negates all other warranties. Furthermore, CricTrend does not make any representations concerning
                    the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or
                    any sites linked to this Website.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>4. Limitations</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use
                    the materials on CricTrend's Website, even if CricTrend or an authorize representative of this Website has been notified,
                    orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties
                    or limitations of liability for incidental damages, these limitations may not apply to you.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>5. Revisions and Errata</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    The materials appearing on CricTrend's Website may include technical, typographical, or photographic errors. CricTrend
                    will not promise that any of the materials in this Website are accurate, complete, or current. CricTrend may change the
                    materials contained on its Website at any time without notice. CricTrend does not make any commitment to update the materials.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>6. Links</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such
                    linked site. The presence of any link does not imply endorsement by CricTrend of the site. The use of any linked website
                    is at the user's own risk.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>7. Site Terms of Use Modifications</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    CricTrend may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are
                    agreeing to be bound by the current version of these Terms and Conditions of Use.
                </p>

                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>8. Governing Law</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Any claim related to CricTrend's Website shall be governed by the laws of in without regards to its conflict of law provisions.
                </p>
            </div>
        </div>
    );
}
