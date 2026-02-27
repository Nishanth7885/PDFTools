'use client';
import { useEffect } from 'react';

export default function AdSense({ format = 'auto', className = '' }) {
    useEffect(() => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
    }, []);

    return (
        <div className={`adsense-wrapper ${className}`}>
            <div className="adsense-placeholder">
                {/* Replace with your real AdSense code after approval:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        */}
                <p>Advertisement</p>
                <span className="adsense-note">
                    We show non-intrusive ads to cover server costs. All tools remain 100% free — forever.
                </span>
            </div>
        </div>
    );
}
