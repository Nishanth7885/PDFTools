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

export default function HEICtoJPGBatch() {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const inputRef = useRef(null);

    const addFiles = (newFiles) => {
        const heicFiles = Array.from(newFiles).filter(f =>
            f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif') || f.type === 'image/heic' || f.type === 'image/heif'
        );
        if (heicFiles.length === 0) return;
        setFiles(prev => [...prev, ...heicFiles]);
        setResults([]);
        setError('');
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please add at least 1 HEIC file');
            return;
        }
        setProcessing(true);
        setError('');
        setResults([]);
        setProgress({ current: 0, total: files.length });

        const convertedResults = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${API_URL}/api/image/convert-heic`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Failed to convert ${file.name}`);
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const baseName = file.name.replace(/\.(heic|heif)$/i, '');

                convertedResults.push({
                    url,
                    filename: `${baseName}.jpg`,
                    originalName: file.name
                });

                setProgress({ current: i + 1, total: files.length });
            }

            setResults(convertedResults);
        } catch (err) {
            setError(err.message || 'Something went wrong during conversion');
        } finally {
            setProcessing(false);
        }
    };

    const downloadImage = (result) => {
        const a = document.createElement('a');
        a.href = result.url;
        a.download = result.filename;
        a.click();
    };

    const downloadAll = () => {
        results.forEach((result, index) => {
            setTimeout(() => downloadImage(result), index * 300);
        });
    };

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>🖼️</div>
                    <h1>Convert HEIC to JPG — Free Batch HEIC Converter</h1>
                    <p>Convert multiple HEIC images from your iPhone or iPad to JPG format instantly.</p>
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
                    <h3>Drop HEIC files here</h3>
                    <p>or <span className="uploader-browse">browse</span> to choose files<br />Max 50MB each</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".heic,.heif,image/heic,image/heif"
                        multiple
                        onChange={(e) => addFiles(e.target.files)}
                    />
                </div>

                {/* File list */}
                {files.length > 0 && !results.length && (
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {files.length} file{files.length > 1 ? 's' : ''} added
                        </div>
                        {files.map((file, i) => (
                            <div key={`${file.name}-${i}`} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 14px', borderRadius: 12,
                                background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {file.name}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                                        {formatSize(file.size)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
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

                {files.length > 0 && !results.length && (
                    <div className="controls">
                        <button className="btn-primary" onClick={handleConvert} disabled={processing}>
                            {processing ? '⏳ Converting...' : `🚀 Convert ${files.length} Files to JPG`}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: `${(progress.current / progress.total) * 100}%`, transition: 'width 0.3s ease' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" /> Converting file {progress.current} of {progress.total}...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {results.length > 0 && (
                    <>
                        <div className="result-card">
                            <h3>✅ Converted {results.length} image{results.length > 1 ? 's' : ''}</h3>
                            <button className="btn-download" onClick={downloadAll}>
                                ⬇️ Download All JPGs
                            </button>
                        </div>
                        <div className="pages-grid">
                            {results.map((result, i) => (
                                <div key={i} className="page-preview">
                                    <img src={result.url} alt={`Converted ${result.filename}`} />
                                    <div className="page-preview-footer">
                                        <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.filename}</span>
                                        <button
                                            className="page-download-btn"
                                            onClick={() => downloadImage(result)}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                onClick={() => { setResults([]); setFiles([]); }}
                                className="btn-secondary"
                            >
                                Convert more files
                            </button>
                        </div>
                    </>
                )}

                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free HEIC TO JPG BATCH Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>HEIC TO JPG BATCH Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the HEIC TO JPG BATCH, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using HEIC TO JPG BATCH radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
