'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import SeoContent from '@/components/SeoContent';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function HtmlToPDF() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handle = async () => {
        if (!content.trim()) { setError('Enter some content'); return; }
        setProcessing(true); setError(''); setResult(null);
        try {
            const r = await fetch(`${API}/api/pdf/html-to-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });
            if (!r.ok) { let eTxt = await r.text(); let eObj = {}; try { eObj = JSON.parse(eTxt); } catch (e) { } throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), outputSize: +r.headers.get('X-Output-Size'), filename: `${title || 'document'}.pdf` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(236,72,153,0.08)' }}>📝</div>
                    <h1>Convert Text to PDF Online — Free Text to PDF Creator</h1>
                    <p>Convert text or notes into a beautifully formatted PDF document</p>
                </div>
                <AdSense />
                <div className="controls">
                    <div className="control-group">
                        <label>Document Title (optional)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Document"
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                    <div className="control-group">
                        <label>Content</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={"Paste or type your content here...\n\nFormatting tips:\n# Heading 1\n## Heading 2\n### Heading 3\n- Bullet point\n* Another bullet\n\nRegular paragraph text."}
                            rows={12} style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }} />
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                            Supports basic formatting: <code style={{ background: 'var(--bg-inset)', padding: '1px 5px', borderRadius: 3 }}># Heading</code>, <code style={{ background: 'var(--bg-inset)', padding: '1px 5px', borderRadius: 3 }}>## Subheading</code>, <code style={{ background: 'var(--bg-inset)', padding: '1px 5px', borderRadius: 3 }}>- Bullets</code>
                        </div>
                    </div>
                    {!result && (
                        <button className="btn-primary" onClick={handle} disabled={processing || !content.trim()}>
                            {processing ? '⏳ Creating PDF...' : '📝 Generate PDF'}
                        </button>
                    )}
                </div>
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '70%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Generating PDF document...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Generated</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Size</div><div className="result-stat-value">{fmt(result.outputSize)}</div></div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download PDF</button>
                            <button className="btn-primary" onClick={() => setResult(null)} style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', boxShadow: 'none', border: '1px solid var(--border-primary)' }}>✏️ Edit & Regenerate</button>
                        </div>
                    </div>
                )}
                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free HTML TO PDF Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>HTML TO PDF Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the HTML TO PDF, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using HTML TO PDF radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div><Footer /></>
    );
}
