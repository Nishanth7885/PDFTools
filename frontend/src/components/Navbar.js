'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tools = [
    { name: 'Compress', href: '/pdf-compressor' },
    { name: 'Merge', href: '/pdf-merger' },
    { name: 'Split', href: '/split-pdf' },
    { name: 'PDF↔JPG', href: '/pdf-to-jpg' },
    { name: 'JPG→PDF', href: '/jpg-to-pdf' },
    { name: 'PDF↔Word', href: '/pdf-to-word' },
    { name: 'Rotate', href: '/rotate-pdf' },
    { name: 'Watermark', href: '/watermark-pdf' },
    { name: '🔒 Protect', href: '/pdf-password' },
    { name: '🔓 Unlock', href: '/unlock-pdf' },
    { name: '#️⃣ Pages', href: '/page-numbers' },
    { name: 'Organize', href: '/organize-pdf' },
    { name: 'Text→PDF', href: '/html-to-pdf' },
    { name: 'Resize', href: '/image-resizer' },
    { name: 'Convert', href: '/image-converter' },
    { name: '🛡️ Metadata', href: '/metadata-stripper' },
    { name: 'Video→Audio', href: '/video-to-audio' },
    { name: '🎵 Audio', href: '/audio-converter' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/" className="navbar-brand">
                    <div className="navbar-brand-icon">⚡</div>
                    Safe File Converter
                </Link>
                <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? '✕' : '☰'}
                </button>
                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className={`navbar-link ${pathname === tool.href ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                            {tool.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
