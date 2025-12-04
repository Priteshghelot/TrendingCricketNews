import './globals.css';
import { Roboto } from 'next/font/google';
import Link from 'next/link';

const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata = {
    metadataBase: new URL('https://crictrend.vercel.app'),
    title: {
        default: 'CricTrend - Live Cricket Scores, News & Updates',
        template: '%s | CricTrend',
    },
    description: 'Get the latest cricket news, live scores, and breaking updates from around the world.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://crictrend.vercel.app',
        title: 'CricTrend - Live Cricket Scores',
        description: 'Get the latest cricket news, live scores, and breaking updates.',
        siteName: 'CricTrend',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CricTrend - Live Cricket Scores',
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
                <meta name="theme-color" content="#03a9f4" />
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
            <body className={roboto.className}>
                <header className="header">
                    <div className="container header-inner">
                        <Link href="/" className="logo">
                            <span>CricTrend</span>
                        </Link>
                        <nav className="nav-links">
                            <Link href="/" className="nav-link">Live Scores</Link>
                            <Link href="/" className="nav-link">Series</Link>
                            <Link href="/" className="nav-link">Teams</Link>
                            <Link href="/" className="nav-link">News</Link>
                            <Link href="/login" className="nav-link btn-admin">Admin</Link>
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
