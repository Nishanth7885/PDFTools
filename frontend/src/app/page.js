import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';

const tools = [
  { name: 'PDF Compressor', description: 'Reduce PDF file size while maintaining quality.', href: '/pdf-compressor', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>, iconBg: 'rgba(239,68,68,0.08)' },
  { name: 'Split PDF', description: 'Extract specific pages from a PDF. Keep only what you need.', href: '/split-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>, iconBg: 'rgba(245,158,11,0.08)' },
  { name: 'PDF Merger', description: 'Combine multiple PDFs into a single document.', href: '/pdf-merger', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6-4-4-4 4" /><path d="M12 2v8" /><path d="m8 18 4 4 4-4" /><path d="M12 14v8" /><path d="M21 12H3" /></svg>, iconBg: 'rgba(59,130,246,0.08)' },
  { name: 'PDF to JPG', description: 'Convert PDF pages into high-quality JPG images.', href: '/pdf-to-jpg', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>, iconBg: 'rgba(245,158,11,0.08)' },
  { name: 'JPG to PDF', description: 'Convert JPG & PNG images into a multi-page PDF.', href: '/jpg-to-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>, iconBg: 'rgba(34,197,94,0.08)' },
  { name: 'PDF to Word', description: 'Convert PDF to editable DOCX documents.', href: '/pdf-to-word', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg>, iconBg: 'rgba(59,130,246,0.08)' },
  { name: 'Word to PDF', description: 'Convert DOCX files to professional PDF format.', href: '/word-to-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>, iconBg: 'rgba(99,102,241,0.08)' },
  { name: 'Rotate PDF', description: 'Rotate all pages by 90°, 180°, or 270°.', href: '/rotate-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>, iconBg: 'rgba(59,130,246,0.08)' },
  { name: 'Watermark PDF', description: 'Add text watermark to every page. Customizable opacity & size.', href: '/watermark-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>, iconBg: 'rgba(139,92,246,0.08)' },
  { name: 'PDF Password', description: 'Encrypt PDFs with AES password protection.', href: '/pdf-password', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, iconBg: 'rgba(99,102,241,0.08)' },
  { name: 'Unlock PDF', description: 'Remove password protection from encrypted PDFs.', href: '/unlock-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>, iconBg: 'rgba(245,158,11,0.08)' },
  { name: 'Page Numbers', description: 'Add page numbers to every page. Choose position & format.', href: '/page-numbers', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M6 14h6" /><path d="M6 18h6" /><path d="M6 10h2" /></svg>, iconBg: 'rgba(59,130,246,0.08)' },
  { name: 'Organize PDF', description: 'Reorder, duplicate, or remove pages from your PDF.', href: '/organize-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>, iconBg: 'rgba(139,92,246,0.08)' },
  { name: 'Text to PDF', description: 'Convert text & notes into a formatted PDF document.', href: '/html-to-pdf', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>, iconBg: 'rgba(236,72,153,0.08)' },
  { name: 'JPG Compressor', description: 'Compress images with adjustable quality. MozJPEG optimized.', href: '/jpg-compressor', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" /><circle cx="10" cy="13" r="2" /><path d="m20 21-4.086-4.086a2 2 0 0 0-2.828 0L9 21" /></svg>, iconBg: 'rgba(34,197,94,0.08)' },
  { name: 'Image Resizer', description: 'Resize to exact dimensions or target file size.', href: '/image-resizer', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>, iconBg: 'rgba(59,130,246,0.08)' },
  { name: 'Image Converter', description: 'Convert between JPG, PNG, WebP, AVIF, TIFF, GIF.', href: '/image-converter', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M3 10h18" /><path d="m5 6 7-3 7 3v4H5V6z" /><path d="M10 21v-5a2 2 0 0 1 4 0v5" /></svg>, iconBg: 'rgba(139,92,246,0.08)' },
  { name: 'Metadata Stripper', description: 'Remove hidden EXIF, GPS, camera info from photos.', href: '/metadata-stripper', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>, iconBg: 'rgba(239,68,68,0.08)' },
  { name: 'Video to Audio', description: 'Extract audio from MP4, MKV, AVI, MOV & more.', href: '/video-to-audio', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" ry="2" /></svg>, iconBg: 'rgba(236,72,153,0.08)' },
  { name: 'Audio Converter', description: 'Convert MP3, WAV, AAC, OGG, FLAC, OPUS & more.', href: '/audio-converter', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>, iconBg: 'rgba(245,158,11,0.08)' },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <span className="hero-badge">
          🎉 100% Free — No Sign Up — No Limits
        </span>
        <h1>All-in-One File Tools<br />for Everyone</h1>
        <p>
          Compress, convert, merge, split, protect, and transform your PDFs, images, audio &amp; video — right
          in your browser. Private, fast, and <strong>free forever</strong>.
        </p>
      </section>

      {/* ── Free Forever Banner ── */}
      <section className="how-it-works" style={{ paddingBottom: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
          borderRadius: 16, background: 'linear-gradient(135deg, var(--accent-light), rgba(139,92,246,0.08))',
          border: '1px solid var(--accent)', maxWidth: 700, margin: '0 auto',
        }}>
          <span style={{ fontSize: '2rem', flexShrink: 0 }}>💚</span>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Free Forever — Here&apos;s Why
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We believe file tools should be free for everyone. We show small, non-intrusive ads to cover our server and bandwidth costs.
              That&apos;s it — <strong>no paywall, no signup, no limits</strong>. Every tool on this site is and will always be <strong>100% free</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ad after hero ── */}
      <AdSense />

      {/* ── Tools Grid ── */}
      <section className="home-tools-section">
        <h2>All Tools</h2>
        <p>{tools.length} powerful tools — all free, all private</p>
        <div className="home-layout-grid">
          {/* Left Vertical Ad */}
          <aside className="sidebar-ads sidebar-left">
            <div className="sidebar-ad-card">
              <p className="sidebar-label">Sponsor</p>
              <div className="sidebar-ad-slot">
                <AdSense format="vertical" />
              </div>
            </div>
          </aside>
          <div className="tools-grid-container">
            <div className="tools-grid">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="tool-card">
                  <div className="tool-card-icon" style={{ background: tool.iconBg }}>
                    {tool.icon}
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Vertical Ad */}
          <aside className="sidebar-ads sidebar-right">
            <div className="sidebar-ad-card">
              <p className="sidebar-label">Sponsor</p>
              <div className="sidebar-ad-slot">
                <AdSense format="vertical" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Ad between sections ── */}
      <AdSense />

      {/* ── How It Works ── */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>Three simple steps to get your result</p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Upload Your File</h3>
            <p>Drag &amp; drop or browse to select your file. We support PDFs, images, audio, and video.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Choose Options</h3>
            <p>Select your format, quality, size, or other settings. Each tool has smart defaults.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Download Result</h3>
            <p>Get your processed file instantly. All files are automatically deleted from our servers.</p>
          </div>
        </div>
      </section>

      {/* ── Privacy section ── */}
      <section className="privacy-section" id="privacy">
        <div className="privacy-card">
          <div className="privacy-card-icon">🛡️</div>
          <h2>Zero Data Storage Policy</h2>
          <p>
            We believe your files are yours alone. That&apos;s why we built this platform with a strict
            no-data-retention architecture. Here&apos;s our promise:
          </p>
          <div className="privacy-features">
            <div className="privacy-feature">
              <div className="privacy-feature-icon">🗑️</div>
              <h4>Instant Deletion</h4>
              <p>Files are deleted immediately after processing. Nothing is ever saved.</p>
            </div>
            <div className="privacy-feature">
              <div className="privacy-feature-icon">🔐</div>
              <h4>No Logging</h4>
              <p>We don&apos;t log file contents, names, or any personally identifiable information.</p>
            </div>
            <div className="privacy-feature">
              <div className="privacy-feature-icon">🚫</div>
              <h4>No Third-Party Access</h4>
              <p>Your files are never shared with, sold to, or accessed by any third party.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ad before comparison ── */}
      <AdSense />

      {/* ── Why Choose Us ── */}
      <section className="how-it-works">
        <h2>Why Choose Us?</h2>
        <p>See how we compare to other online file tools</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0, borderRadius: 16, overflow: 'hidden', marginTop: 24,
          border: '1px solid var(--border-primary)', background: 'var(--bg-surface)',
          fontSize: '0.82rem', textAlign: 'center',
        }}>
          {['Feature', 'Us', 'iLovePDF', 'SmallPDF'].map((h, i) => (
            <div key={h} style={{
              padding: '14px 12px', fontWeight: 700, fontSize: '0.78rem',
              background: i === 1 ? 'var(--accent-light)' : 'var(--bg-surface-secondary)',
              color: i === 1 ? 'var(--accent)' : 'var(--text-primary)',
              borderBottom: '1px solid var(--border-primary)',
            }}>{h}</div>
          ))}
          {[
            ['100% Free', '✅', '⚠️ Limited', '❌ Paid'],
            ['No Sign Up', '✅', '❌', '❌'],
            ['No Data Storage', '✅', '❌', '❌'],
            ['20+ Tools', '✅', '✅', '⚠️ Paid'],
            ['EXIF Stripping', '✅', '❌', '❌'],
            ['PDF Encryption', '✅', '✅', '⚠️ Paid'],
            ['Audio/Video', '✅', '❌', '❌'],
            ['Upload Limit', '50MB', '15MB', '5MB Free'],
          ].map(([feature, ...vals], rowIdx) => (
            [feature, ...vals].map((cell, colIdx) => (
              <div key={`${rowIdx}-${colIdx}`} style={{
                padding: '11px 10px',
                background: colIdx === 1 ? 'var(--accent-light)' : 'transparent',
                color: cell === '✅' ? 'var(--success)' : cell.includes('❌') ? 'var(--error)' : 'var(--text-secondary)',
                fontWeight: colIdx === 0 ? 600 : 500,
                borderBottom: rowIdx < 7 ? '1px solid var(--border-primary)' : 'none',
              }}>{cell}</div>
            ))
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="how-it-works" style={{ paddingBottom: 48 }}>
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know</p>
        <div style={{ textAlign: 'left', maxWidth: 660, margin: '32px auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { q: 'Is this really free?', a: 'Yes, 100% free with no hidden limits. We show non-intrusive ads to cover server costs. There are no premium tiers, no signup walls, and no usage limits. Every tool is free — forever.' },
            { q: 'Why do you show ads?', a: 'Processing files — especially video and audio — requires powerful servers that cost money to run. Instead of charging users or limiting features, we chose to display small, non-intrusive advertisements. This lets us keep everything free for everyone.' },
            { q: 'Are my files safe?', a: 'Absolutely. Files are processed and immediately deleted. We never store, view, or share your files. Our entire pipeline uses zero-retention architecture. Read our Privacy Policy for full details.' },
            { q: 'Do I need an account?', a: 'No. Everything works instantly without registration, email verification, or login. Just upload your file and get your result.' },
            { q: 'What formats are supported?', a: 'PDF, JPG, PNG, WebP, AVIF, TIFF, GIF, DOCX for documents & images. MP4, MKV, AVI, MOV, WebM for video. MP3, WAV, AAC, OGG, FLAC, OPUS, M4A for audio.' },
            { q: 'What\'s the file size limit?', a: '50MB per file for all tools. This is higher than most free alternatives (iLovePDF: 15MB, SmallPDF: 5MB free).' },
          ].map((item, i) => (
            <details key={i} style={{ padding: '18px 22px', borderRadius: 14, background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {item.q}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: 12 }}>＋</span>
              </summary>
              <p style={{ marginTop: 12, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Bottom Ad ── */}
      <AdSense />
      <Footer />
    </>
  );
}
