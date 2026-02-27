'use client';
import { useEffect, useRef } from 'react';

export default function AdSense({ format = 'auto', slot = '', className = '' }) {
    const adRef = useRef(null);
    const pushed = useRef(false);

    useEffect(() => {
        if (pushed.current) return;
        try {
            if (adRef.current && adRef.current.children.length === 0) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                pushed.current = true;
            }
        } catch (e) {
            console.log('AdSense error:', e);
        }
    }, []);

    return (
        <div className={`adsense-wrapper ${className}`}>
            <div className="adsense-container" ref={adRef}>
                <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-5025681441388003"
                    data-ad-slot={slot || ''}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />
            </div>
            <span className="adsense-note">
                Ads help us keep all 20+ tools free — no signup, no limits, forever.
            </span>
        </div>
    );
}
