import './globals.css';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import MobileNav from '@/components/MobileNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://crictrend.vercel.app'),
  title: {
    default: 'CricTrend - Live Cricket Scores & Latest News',
    template: '%s | CricTrend',
  },
  description: 'Get live cricket scores, ball-by-ball commentary, and the latest cricket news. Stay updated with CricTrend - your ultimate cricket companion.',
  keywords: ['cricket', 'live scores', 'cricket news', 'ball-by-ball', 'cricket updates', 'sports news', 'cricket commentary'],
  authors: [{ name: 'CricTrend' }],
  creator: 'CricTrend',
  publisher: 'CricTrend',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crictrend.vercel.app',
    title: 'CricTrend - Live Cricket Scores & Latest News',
    description: 'Get live cricket scores, ball-by-ball commentary, and the latest cricket news.',
    siteName: 'CricTrend',
    images: [
      {
        url: '/images/default-news.jpg',
        width: 1200,
        height: 630,
        alt: 'CricTrend - Cricket News and Scores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CricTrend - Live Cricket Scores & Latest News',
    description: 'Get live cricket scores, ball-by-ball commentary, and the latest cricket news.',
    images: ['/images/default-news.jpg'],
    creator: '@crictrend',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#0f172a" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3583801342408600"
          crossOrigin="anonymous"
        />
      </head>
      <body className={outfit.className}>
        <GoogleAnalytics />
        <nav style={{
          borderBottom: '1px solid var(--card-border)',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 100
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>Cric</span>
              <span style={{ color: 'white' }}>Trend</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s', fontWeight: '500' }}>
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
                  gap: '0.5rem',
                  fontWeight: '500'
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
              <Link href="/archive" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s', fontWeight: '500' }}>
                Archive
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
