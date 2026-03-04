'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function WatermarkPDF() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [opacity, setOpacity] = useState(15);
    const [fontSize, setFontSize] = useState(48);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleWatermark = async () => {
        if (!file || !text.trim()) { setError('Enter watermark text'); return; }
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('text', text); fd.append('opacity', (opacity / 100).toString()); fd.append('fontSize', fontSize.toString());
        try {
            const r = await fetch(`${API}/api/pdf/watermark`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Watermark failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), filename: `watermarked-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(139,92,246,0.08)' }}>💧</div>
                    <h1>Add Watermark to PDF Online — Free PDF Watermark Tool</h1>
                    <p>Add a diagonal text watermark to every page of your PDF</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Watermark Text</label>
                            <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="CONFIDENTIAL" maxLength={50} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                        </div>
                        <div className="control-group">
                            <label>Opacity: {opacity}%</label>
                            <div className="slider-wrapper">
                                <input type="range" min="5" max="80" value={opacity} onChange={e => setOpacity(+e.target.value)} />
                                <span className="slider-value">{opacity}%</span>
                            </div>
                        </div>
                        <div className="control-group">
                            <label>Font Size: {fontSize}px</label>
                            <div className="slider-wrapper">
                                <input type="range" min="16" max="120" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
                                <span className="slider-value">{fontSize}px</span>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleWatermark} disabled={processing}>
                            {processing ? '⏳ Adding...' : '💧 Add Watermark'}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '60%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Adding watermark to pages...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ Watermark Added</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Text</div><div className="result-stat-value" style={{ fontSize: '0.82rem' }}>{text}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download Watermarked PDF</button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
                    <h2>How to Add Watermarks to PDFs for Free</h2>
                    <p>Protect your PDF documents by adding a custom text watermark across every page. Fully customize the watermark text, font size, opacity, color, and rotation angle. Perfect for branding and copyright protection.</p>
                    <p><strong>Common use cases:</strong> Adding "CONFIDENTIAL" or "DRAFT" labels, branding client deliverables, protecting intellectual property, and marking preview copies of ebooks or reports.</p>
                    <p>Free with no signup, no limits, and zero data retention. Safe File Converter never stores your documents.</p>
                </SeoContent>
            </div><Footer /></>
    );
}
