'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function JpgToPDF() {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const addFiles = (newFiles) => {
        const imgs = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
        if (imgs.length) { setFiles(prev => [...prev, ...imgs]); setResult(null); setError(''); }
    };
    const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleConvert = async () => {
        if (files.length < 1) { setError('Add at least 1 image'); return; }
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); files.forEach(f => fd.append('files', f));
        try {
            const r = await fetch(`${API}/api/pdf/jpg-to-pdf`, { method: 'POST', body: fd });
            if (!r.ok) throw new Error((await r.json()).error || 'Conversion failed');
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), fileCount: +r.headers.get('X-File-Count'), outputSize: +r.headers.get('X-Output-Size'), filename: 'images.pdf' });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(34,197,94,0.08)' }}>📸</div>
                    <h1>JPG to PDF</h1>
                    <p>Convert JPG, PNG, or other images into a multi-page PDF</p>
                </div>
                <AdSense />
                <div className={`uploader ${dragOver ? 'drag-over' : ''}`} onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
                    onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}>
                    <div className="uploader-icon">🖼️</div>
                    <h3>Drop images here</h3>
                    <p>or <span className="uploader-browse">browse</span> to choose files<br />JPG, PNG • Each image becomes a page</p>
                    <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} />
                </div>
                {files.length > 0 && (
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{files.length} image{files.length > 1 ? 's' : ''} — each becomes a PDF page</div>
                        {files.map((f, i) => (
                            <div key={`${f.name}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-primary)' }}>
                                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{fmt(f.size)}</div>
                                </div>
                                <button onClick={() => removeFile(i)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--error-light)', background: 'var(--error-light)', color: 'var(--error)', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                            </div>
                        ))}
                        <button onClick={() => inputRef.current?.click()} style={{ padding: '10px', borderRadius: 10, border: '1px dashed var(--border-secondary)', background: 'transparent', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add more images</button>
                    </div>
                )}
                {files.length >= 1 && !result && (
                    <div className="controls">
                        <button className="btn-primary" onClick={handleConvert} disabled={processing}>
                            {processing ? '⏳ Converting...' : `📸 Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Creating PDF from images...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Created</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Images</div><div className="result-stat-value">{result.fileCount}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Size</div><div className="result-stat-value">{fmt(result.outputSize)}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download PDF</button>
                    </div>
                )}
                <AdSense />
            </div><Footer /></>
    );
}
