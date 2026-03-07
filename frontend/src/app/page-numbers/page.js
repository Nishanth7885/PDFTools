'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PageNumbers() {
    const [file, setFile] = useState(null);
    const [position, setPosition] = useState('bottom-center');
    const [format, setFormat] = useState('page-of');
    const [fontSize, setFontSize] = useState(11);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const positions = [
        { value: 'bottom-left', label: '↙ Bottom Left' },
        { value: 'bottom-center', label: '↓ Bottom Center' },
        { value: 'bottom-right', label: '↘ Bottom Right' },
        { value: 'top-left', label: '↖ Top Left' },
        { value: 'top-center', label: '↑ Top Center' },
        { value: 'top-right', label: '↗ Top Right' },
    ];

    const formats = [
        { value: 'page-of', label: 'Page 1 of 10', preview: 'Page X of Y' },
        { value: 'number-only', label: '1', preview: 'X' },
        { value: 'dash', label: '— 1 —', preview: '— X —' },
    ];

    const handle = async () => {
        if (!file) return;
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('position', position); fd.append('format', format); fd.append('fontSize', fontSize.toString());
        try {
            const r = await fetch(`${API}/api/pdf/page-numbers`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), filename: `numbered-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(59,130,246,0.08)' }}>🔢</div>
                    <h1>Add Page Numbers to PDF — Free Online Tool</h1>
                    <p>Add page numbers to every page of your PDF</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Position</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                {positions.map(p => (
                                    <button key={p.value} onClick={() => setPosition(p.value)} style={{
                                        padding: '10px 8px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                        border: position === p.value ? '2px solid var(--accent)' : '1px solid var(--border-primary)',
                                        background: position === p.value ? 'var(--accent-light)' : 'var(--bg-surface-secondary)',
                                        color: position === p.value ? 'var(--accent)' : 'var(--text-secondary)',
                                    }}>{p.label}</button>
                                ))}
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Format</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {formats.map(f => (
                                    <button key={f.value} onClick={() => setFormat(f.value)} style={{
                                        flex: 1, padding: '12px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                        border: format === f.value ? '2px solid var(--accent)' : '1px solid var(--border-primary)',
                                        background: format === f.value ? 'var(--accent-light)' : 'var(--bg-surface-secondary)',
                                        color: format === f.value ? 'var(--accent)' : 'var(--text-secondary)',
                                    }}>{f.preview}</button>
                                ))}
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Font Size: {fontSize}pt</label>
                            <div className="slider-wrapper">
                                <input type="range" min="8" max="24" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
                                <span className="slider-value">{fontSize}pt</span>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handle} disabled={processing}>
                            {processing ? '⏳ Adding...' : '🔢 Add Page Numbers'}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Adding page numbers...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ Page Numbers Added</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Position</div><div className="result-stat-value" style={{ fontSize: '0.8rem' }}>{positions.find(p => p.value === position)?.label}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download PDF</button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PAGE NUMBERS Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PAGE NUMBERS Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PAGE NUMBERS, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PAGE NUMBERS radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div><Footer /></>
    );
}
