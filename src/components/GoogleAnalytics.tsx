'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Don't render if no measurement ID is set
    if (!measurementId) {
        console.warn('Google Analytics Measurement ID not found. Please add NEXT_PUBLIC_GA_MEASUREMENT_ID to your .env.local file.');
        return null;
    }

    return (
        <>
            {/* Google tag (gtag.js) */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
            </Script>
        </>
    );
}
