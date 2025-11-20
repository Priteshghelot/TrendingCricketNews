'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
}

export default function AdSense({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = { display: 'block' }
}: AdSenseProps) {
    const adRequested = useRef(false);

    useEffect(() => {
        if (adRequested.current) return;
        adRequested.current = true;

        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={style}
            data-ad-client="ca-pub-3583801342408600"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive.toString()}
        />
    );
}
