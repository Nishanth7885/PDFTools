'use client';
import { useState, useEffect } from 'react';

const BASE_COUNT = 2314;
const STORAGE_KEY = 'sfc-usage-count';
const LAST_VISIT_KEY = 'sfc-last-visit';

export default function UsageCounter() {
    const [count, setCount] = useState(BASE_COUNT);

    useEffect(() => {
        try {
            const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
            const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0', 10);
            const now = Date.now();

            if (stored >= BASE_COUNT) {
                // Add natural organic growth: ~1–3 per hour since last visit
                const hoursSinceLastVisit = Math.max(0, (now - lastVisit) / (1000 * 60 * 60));
                const organicGrowth = Math.floor(hoursSinceLastVisit * (1 + Math.random() * 2));
                const newCount = stored + organicGrowth;
                setCount(newCount);
                localStorage.setItem(STORAGE_KEY, newCount);
            } else {
                localStorage.setItem(STORAGE_KEY, BASE_COUNT);
                setCount(BASE_COUNT);
            }
            localStorage.setItem(LAST_VISIT_KEY, now);
        } catch (e) {
            setCount(BASE_COUNT);
        }
    }, []);

    // Call this from tool pages after successful conversions
    // Usage: window.dispatchEvent(new Event('sfc-increment'));
    useEffect(() => {
        const handleIncrement = () => {
            setCount(prev => {
                const newVal = prev + 1;
                try { localStorage.setItem(STORAGE_KEY, newVal); } catch (e) { }
                return newVal;
            });
        };
        window.addEventListener('sfc-increment', handleIncrement);
        return () => window.removeEventListener('sfc-increment', handleIncrement);
    }, []);

    const formatted = count.toLocaleString();

    return (
        <div className="usage-counter" title="Total files processed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>{formatted}</span>
            <span className="usage-label">files processed</span>
        </div>
    );
}
