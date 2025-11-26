import './globals.css';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import MobileNav from '@/components/MobileNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://crictrend.vercel.app'),
  title: {
    default: 'Latest Cricket News, Live Scores & Breaking Updates | CricTrend',
    template: '%s | CricTrend - #1 for Cricket News',
  },
  description: '⚡ Get the fastest Cricket News, Live Scores, and Ball-by-Ball Commentary. Breaking updates on IPL, World Cup, Test Cricket, ODI, and T20. Stay ahead with CricTrend.',
  keywords: [
    'latest cricket news',
    'breaking cricket news',
    'live cricket scores',
    'cricket updates today',
    'ball by ball commentary',
    'IPL news',
    'cricket world cup',
    'Indian cricket team news',
    'test match score',
    'today match update'
  ],
  authors: [{ name: 'CricTrend Sports Desk' }],
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
    title: 'Latest Cricket News & Live Scores | CricTrend',
    description: '⚡ Breaking: Get the fastest cricket news, live match scores, and expert analysis. Coverage of IPL, Team India, Australia, England, and World Cricket.',
    siteName: 'CricTrend',
    images: [
      {
        url: '/images/default-news.jpg',
        width: 1200,
        height: 630,
        alt: 'Latest Cricket News and Live Scores - CricTrend',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Cricket News & Live Scores | CricTrend',
    description: '⚡ Breaking: Get the fastest cricket news, live match scores, and expert analysis.',
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
    google: 'google58b03ba23a8ce0bc',
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
