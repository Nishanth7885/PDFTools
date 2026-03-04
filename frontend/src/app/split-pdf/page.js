'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function SplitPDF() {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState('');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSplit = async () => {
        if (!file || !pages.trim()) { setError('Enter page range'); return; }
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('pages', pages);
        try {
            const r = await fetch(`${API}/api/pdf/split`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Split failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), originalSize: +r.headers.get('X-Original-Size'), outputSize: +r.headers.get('X-Output-Size'), originalPages: +r.headers.get('X-Original-Pages'), extractedPages: +r.headers.get('X-Extracted-Pages'), filename: `split-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(245,158,11,0.08)' }}>✂️</div>
                    <h1>Split PDF Online — Free PDF Page Extractor</h1>
                    <p>Extract specific pages from a PDF document</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Pages to extract</label>
                            <input type="text" value={pages} onChange={e => setPages(e.target.value)} placeholder="e.g. 1-3, 5, 8-10" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>Comma-separated pages or ranges. Example: 1-3, 5, 7-10</span>
                        </div>
                        <button className="btn-primary" onClick={handleSplit} disabled={processing}>
                            {processing ? '⏳ Splitting...' : '✂️ Split PDF'}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Extracting pages...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ Pages Extracted</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Original</div><div className="result-stat-value">{result.originalPages} pages</div></div>
                            <div className="result-stat"><div className="result-stat-label">Extracted</div><div className="result-stat-value">{result.extractedPages} pages</div></div>
                            <div className="result-stat"><div className="result-stat-label">Size</div><div className="result-stat-value">{fmt(result.outputSize)}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download Split PDF</button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
                    <h2>How to Split PDF Files for Free</h2>
                    <p>Our PDF splitter lets you extract specific pages from any PDF document. Simply enter the page numbers or ranges you want (e.g., 1-3, 5, 8-10) and download only the pages you need as a new, smaller PDF.</p>
                    <p><strong>Supported formats:</strong> Any standard PDF file up to 50MB. Works with reports, contracts, ebooks, manuals, and any multi-page PDF document.</p>
                    <p><strong>Common use cases:</strong> Extracting chapters from textbooks, separating individual pages from scanned documents, pulling specific pages from legal contracts, and trimming large PDF files to share only relevant content.</p>
                    <p>Safe File Converter processes your file securely and deletes it immediately after download. No signup, no watermarks, no daily limits — completely free forever.</p>
                </SeoContent>
            </div><Footer /></>
    );
}
