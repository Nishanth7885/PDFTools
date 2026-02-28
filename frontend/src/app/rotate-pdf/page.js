'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const fmt = (b) => { if (!b) return '0 B'; const k = 1024, s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]; };

export default function RotatePDF() {
    const [file, setFile] = useState(null);
    const [angle, setAngle] = useState('90');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleRotate = async () => {
        if (!file) return;
        setProcessing(true); setError(''); setResult(null);
        const fd = new FormData(); fd.append('file', file); fd.append('angle', angle);
        try {
            const r = await fetch(`${API}/api/pdf/rotate`, { method: 'POST', body: fd });
            if (!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || 'Rotate failed'); }
            const blob = await r.blob();
            setResult({ url: URL.createObjectURL(blob), pages: +r.headers.get('X-Page-Count'), filename: `rotated-${file.name}` });
        } catch (e) { setError(e.message); } finally { setProcessing(false); }
    };

    return (
        <><Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(59,130,246,0.08)' }}>🔄</div>
                    <h1>Rotate PDF</h1>
                    <p>Rotate all pages of your PDF by 90°, 180°, or 270°</p>
                </div>
                <AdSense />
                <FileUploader accept=".pdf" file={file} onFileSelect={f => { setFile(f); setResult(null); setError(''); }} onRemove={() => { setFile(null); setResult(null); }} />
                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Rotation Angle</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['90', '180', '270'].map(a => (
                                    <button key={a} onClick={() => setAngle(a)} style={{
                                        flex: 1, padding: '14px', borderRadius: 12, border: angle === a ? '2px solid var(--accent)' : '1px solid var(--border-primary)',
                                        background: angle === a ? 'var(--accent-light)' : 'var(--bg-surface-secondary)', color: angle === a ? 'var(--accent)' : 'var(--text-secondary)',
                                        fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
                                    }}>{a}°</button>
                                ))}
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleRotate} disabled={processing}>
                            {processing ? '⏳ Rotating...' : `🔄 Rotate ${angle}°`}
                        </button>
                    </div>
                )}
                {processing && <div style={{ marginTop: 16 }}><div className="progress-bar-wrapper"><div className="progress-bar" style={{ width: '70%', animation: 'pulse 1.5s infinite' }} /></div><div className="processing-text"><div className="spinner" />Rotating pages...</div></div>}
                {error && <div className="error-message">⚠️ {error}</div>}
                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Rotated {angle}°</h3>
                        <div className="result-stats">
                            <div className="result-stat"><div className="result-stat-label">Pages</div><div className="result-stat-value">{result.pages}</div></div>
                            <div className="result-stat"><div className="result-stat-label">Angle</div><div className="result-stat-value">{angle}°</div></div>
                        </div>
                        <button className="btn-download" onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = result.filename; a.click(); }}>⬇️ Download Rotated PDF</button>
                    </div>
                )}
                <AdSense />
            </div><Footer /></>
    );
}
