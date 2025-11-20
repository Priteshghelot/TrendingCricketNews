import './globals.css';
import Link from 'next/link';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'CricTrend - Live Scores & News',
  description: 'The latest cricket news and live scores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <nav style={{
          borderBottom: '1px solid var(--card-border)',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 100
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>Cric</span>
              <span style={{ color: 'white' }}>Trend</span>
            </Link>
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>
                Home
              </Link>
              <Link
                href="/live"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></span>
                Live
              </Link>
              <Link href="/archive" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>
                Archive
              </Link>
            </nav>
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
