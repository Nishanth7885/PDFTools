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
                    <h2>How to Convert HEIC to JPG for Free</h2>
                    <p>Convert Apple HEIC/HEIF image format to universally compatible JPG in batch. HEIC is the default photo format on iPhones and iPads, but most websites, printers, and Windows PCs don't support it natively.</p>
                    <p><strong>Common use cases:</strong> Making iPhone photos compatible with Windows, preparing HEIC photos for online forms, converting photos for printing services that only accept JPG, and sharing iPhone photos with Android users.</p>
                    <p>100% free, browser-based conversion. No signup, no limits. Your photos never leave your device.</p>
                </SeoContent>
            </div>
            <Footer />
        </>
    );
}
