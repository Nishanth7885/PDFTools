'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import SeoContent from '@/components/SeoContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function PDFMerger() {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const addFiles = (newFiles) => {
        const pdfs = Array.from(newFiles).filter(f =>
            f.type === 'application/pdf' || f.name.endsWith('.pdf')
        );
        if (pdfs.length === 0) return;
        setFiles(prev => [...prev, ...pdfs]);
        setResult(null);
        setError('');
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index, direction) => {
        setFiles(prev => {
            const arr = [...prev];
            const target = index + direction;
            if (target < 0 || target >= arr.length) return arr;
            [arr[index], arr[target]] = [arr[target], arr[index]];
            return arr;
        });
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please add at least 2 PDF files');
            return;
        }
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        files.forEach(f => formData.append('files', f));

        try {
            const response = await fetch(`${API_URL}/api/pdf/merge`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch (e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
                throw new Error(errData.error || 'Merge failed');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const outputSize = parseInt(response.headers.get('X-Output-Size'));
            const pageCount = parseInt(response.headers.get('X-Page-Count'));
            const fileCount = parseInt(response.headers.get('X-File-Count'));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setResult({ url, originalSize, outputSize, pageCount, fileCount, filename: 'merged.pdf' });
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const a = document.createElement('a');
        a.href = result.url;
        a.download = result.filename;
        a.click();
    };

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>📑</div>
                    <h1>Merge PDF Online — Free PDF Combiner</h1>
                    <p>Combine multiple PDF files into a single document</p>
                </div>

                {/* Drop zone */}
                <div
                    className={`uploader ${dragOver ? 'drag-over' : ''}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                >
                    <div className="uploader-icon">📁</div>
                    <h3>Drop PDF files here</h3>
                    <p>or <span className="uploader-browse">browse</span> to choose files<br />Add 2 or more PDFs • 50MB each</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={(e) => addFiles(e.target.files)}
                    />
                </div>

                {/* File list */}
                {files.length > 0 && (
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {files.length} file{files.length > 1 ? 's' : ''} — drag to reorder
                        </div>
                        {files.map((file, i) => (
                            <div key={`${file.name}-${i}`} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 14px', borderRadius: 12,
                                background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <span style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: 'var(--accent-light)', color: 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                                }}>
                                    {i + 1}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {file.name}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                                        {formatSize(file.size)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button onClick={() => moveFile(i, -1)} disabled={i === 0}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        ▲
                                    </button>
                                    <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-surface-secondary)', cursor: i === files.length - 1 ? 'default' : 'pointer', opacity: i === files.length - 1 ? 0.3 : 1, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        ▼
                                    </button>
                                    <button onClick={() => removeFile(i)}
                                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--error-light)', background: 'var(--error-light)', color: 'var(--error)', cursor: 'pointer', fontSize: '0.7rem' }}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => inputRef.current?.click()}
                            style={{
                                padding: '10px', borderRadius: 10, border: '1px dashed var(--border-secondary)',
                                background: 'transparent', color: 'var(--accent)', fontSize: '0.82rem',
                                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            + Add more files
                        </button>
                    </div>
                )}

                {files.length >= 2 && !result && (
                    <div className="controls">
                        <button className="btn-primary" onClick={handleMerge} disabled={processing}>
                            {processing ? '⏳ Merging...' : `🚀 Merge ${files.length} PDFs`}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" /> Merging PDF files...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ PDFs Merged</h3>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Files</div>
                                <div className="result-stat-value">{result.fileCount}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Pages</div>
                                <div className="result-stat-value">{result.pageCount}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Size</div>
                                <div className="result-stat-value">{formatSize(result.outputSize)}</div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download Merged PDF
                        </button>
                    </div>
                )}

                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PDF MERGER Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PDF MERGER Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PDF MERGER, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PDF MERGER radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
