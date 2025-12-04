import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    metadataBase: new URL('https://crictrend.vercel.app'),
    title: {
        default: 'CricTrend - Latest Cricket News & Updates',
        template: '%s | CricTrend',
    },
    description: 'Get the latest cricket news, live scores, and breaking updates from around the world.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://crictrend.vercel.app',
        title: 'CricTrend - Latest Cricket News',
        description: 'Get the latest cricket news, live scores, and breaking updates.',
        siteName: 'CricTrend',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CricTrend - Latest Cricket News',
        description: 'Get the latest cricket news, live scores, and breaking updates.',
    },
    verification: {
        google: 'KBpuQ7eYlGowGqUR5Oe3NwVA14kGrJgYOb4ooj4g1nY',
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#0a0a0a" />
                {/* Google AdSense */}
                <meta name="google-adsense-account" content="ca-pub-3583801342408600" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3583801342408600"
                    crossOrigin="anonymous"
                />
                {/* Google Analytics */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-DWLSVY6BXK" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DWLSVY6BXK');
            `,
                    }}
                />
            </head>
            <body className={inter.className}>
                <header className="header">
                    <div className="container header-inner">
                        <Link href="/" className="logo">
                            <span className="logo-cric">Cric</span>
                            <span>Trend</span>
                        </Link>
                        <nav className="nav-links">
                            <Link href="/" className="nav-link">Home</Link>
                            <Link href="/admin" className="nav-link">Admin</Link>
                        </nav>
                    </div>
                </header>
                <main>{children}</main>
                <footer className="footer">
                    <div className="container">
                        <p>&copy; {new Date().getFullYear()} CricTrend. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
