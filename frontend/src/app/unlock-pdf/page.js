'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function UnlockPDF() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handle = async () => {
        if (!file) return;
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('password', password);
        try {
            const r = await fetch(`${API}/api/pdf/unlock`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Unlock failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), outputSize: +r.headers.get('X-Output-Size'), filename: `unlocked-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(245,158,11,0.08)' }}>🔓</div>
                    <h1>Unlock PDF Online — Free PDF Password Remover</h1>
                    <p>Remove password protection from a PDF file</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>PDF Password (if required)</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter current PDF password..."
                                    style={{ width: '100%', padding: '12px 48px 12px 14px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                                    {showPw ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handle} disabled={processing}>
                            {processing ? '⏳ Unlocking...' : '🔓 Unlock PDF'}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '60%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Removing password protection...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Unlocked</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Size</div><div className="result-stat-value">{fmt(result.outputSize)}</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download Unlocked PDF</button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
                    <h2>How to Remove PDF Passwords for Free</h2>
                    <p>Unlock password-protected PDF files so you can open, print, and edit them freely. Upload your locked PDF, enter the correct password, and download the unlocked version without any restrictions.</p>
                    <p><strong>Common use cases:</strong> Unlocking old documents where you know the password but want restriction-free access, removing editing restrictions from your own files, and preparing PDFs for easy sharing.</p>
                    <p>Free, fast, and private. No signup required. Files are processed and deleted instantly.</p>
                </SeoContent>
            </div><Footer /></>
    );
}
