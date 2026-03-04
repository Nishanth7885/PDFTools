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
                    <h2>How to Add Page Numbers to a PDF for Free</h2>
                    <p>Automatically add sequential page numbers to every page of your PDF document. Choose from six positions: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right.</p>
                    <p><strong>Common use cases:</strong> Adding page numbers to reports before printing, numbering thesis or dissertation pages, organizing multi-page contracts, and preparing documents for professional binding.</p>
                    <p>Completely free with no signup or watermarks. Powered by Safe File Converter.</p>
                </SeoContent>
            </div><Footer /></>
    );
}
