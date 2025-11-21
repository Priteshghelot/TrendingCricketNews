'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    suppressHydrationWarning?: boolean;
}

export default function AdSense({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = { display: 'block' },
    suppressHydrationWarning
}: AdSenseProps) {
    const adRequested = useRef(false);
    const insRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        if (adRequested.current) return;

        // Check if element has width before requesting ad
        const checkWidth = () => {
            if (insRef.current && insRef.current.offsetWidth > 0) {
                adRequested.current = true;
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {
                    console.error('AdSense error:', err);
                }
            } else {
                // Retry after a short delay if width is 0
                setTimeout(checkWidth, 100);
            }
        };

        checkWidth();
    }, []);

    return (
        <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ minWidth: '250px', minHeight: '50px', ...style }} // Enforce min dimensions
            data-ad-client="ca-pub-3583801342408600"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive.toString()}
            suppressHydrationWarning={suppressHydrationWarning}
        />
    );
}
