'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    style?: React.CSSProperties;
}

export default function AdSense({
    adSlot,
    adFormat = 'auto',
    style = { display: 'block' },
}: AdSenseProps) {
    const adRequested = useRef(false);
    const insRef = useRef<HTMLModElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (adRequested.current) return;

        const checkWidth = () => {
            if (insRef.current && insRef.current.offsetWidth > 0) {
                // Check if already loaded to prevent error
                if (insRef.current.getAttribute('data-ad-status')) {
                    adRequested.current = true;
                    return;
                }

                adRequested.current = true;
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {
                    console.error('AdSense error:', err);
                }
            } else {
                setTimeout(checkWidth, 100);
            }
        };

        checkWidth();
    }, []);

    if (!mounted) return <div style={{ minWidth: '250px', minHeight: '50px', ...style }} />;

    return (
        <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ minWidth: '250px', minHeight: '50px', ...style }}
            data-ad-client="ca-pub-3583801342408600"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
        />
    );
}
