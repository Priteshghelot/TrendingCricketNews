import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container" style={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary-blue)', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Oops! This ball went for a wide.</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>The page you are looking for doesn't exist or has been moved.</p>
            <Link href="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Back to Home
            </Link>
        </div>
    );
}
