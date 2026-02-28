'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function OrganizePDF() {
    const [file, setFile] = useState(null);
    const [order, setOrder] = useState('');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handle = async () => {
        if (!file || !order.trim()) { setError('Enter page order'); return; }
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('order', order);
        try {
            const r = await fetch(`${API}/api/pdf/organize`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), originalPages: +r.headers.get('X-Original-Pages'), newPages: +r.headers.get('X-New-Pages'), outputSize: +r.headers.get('X-Output-Size'), filename: `organized-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(139,92,246,0.08)' }}>📋</div>
                    <h1>Organize PDF</h1>
                    <p>Reorder, duplicate, or remove pages from your PDF</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>New page order</label>
                            <input type="text" value={order} onChange={e => setOrder(e.target.value)} placeholder="e.g. 3, 1, 2, 5, 4"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                                <strong>Examples:</strong><br />
                                Reverse 5 pages: <code style={{ background: 'var(--bg-inset)', padding: '2px 6px', borderRadius: 4 }}>5, 4, 3, 2, 1</code><br />
                                Keep only pages 1, 3, 5: <code style={{ background: 'var(--bg-inset)', padding: '2px 6px', borderRadius: 4 }}>1, 3, 5</code><br />
                                Duplicate page 1: <code style={{ background: 'var(--bg-inset)', padding: '2px 6px', borderRadius: 4 }}>1, 1, 2, 3</code>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handle} disabled={processing}>
                            {processing ? '⏳ Organizing...' : '📋 Organize PDF'}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '60%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Reorganizing pages...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Reorganized</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Original</div><div className="result-stat-value">{result.originalPages} pages</div></div>
                            <div className="result-stat"><div className="result-stat-label">New</div><div className="result-stat-value">{result.newPages} pages</div></div>
                            <div className="result-stat"><div className="result-stat-label">Size</div><div className="result-stat-value">{fmt(result.outputSize)}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download PDF</button>
                    </div>
                )}
                <AdSense />
            </div><Footer /></>
    );
}
