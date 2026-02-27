'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function JPGCompressor() {
    const [file, setFile] = useState(null);
    const [quality, setQuality] = useState(70);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCompress = async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('quality', quality.toString());

        try {
            const response = await fetch(`${API_URL}/api/image/compress`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Compression failed');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const compressedSize = parseInt(response.headers.get('X-Compressed-Size'));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                originalSize,
                compressedSize,
                savings: Math.round((1 - compressedSize / originalSize) * 100),
                filename: `compressed-${file.name.replace(/\.\w+$/, '.jpg')}`,
            });
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
                    <div className="tool-page-icon" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>🗜️</div>
                    <h1>JPG Compressor</h1>
                    <p>Compress images with adjustable quality using MozJPEG engine</p>
                    <div className="tool-privacy-note">🛡️ Your file is never stored</div>
                </div>

                <FileUploader
                    accept="image/jpeg,image/png,image/webp"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                />

                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Quality ({quality}% — {quality > 80 ? 'High' : quality > 50 ? 'Medium' : 'Low'})</label>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                />
                                <span className="slider-value">{quality}%</span>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleCompress}
                            disabled={processing}
                        >
                            {processing ? '⏳ Compressing...' : '🚀 Compress Image'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '70%' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Optimizing your image...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

                {result && (
                    <div className="result-card">
                        <h3>✅ Compression Complete</h3>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Original</div>
                                <div className="result-stat-value">{formatSize(result.originalSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Compressed</div>
                                <div className="result-stat-value">{formatSize(result.compressedSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Saved</div>
                                <div className="result-stat-value savings">{result.savings}%</div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download Compressed Image
                        </button>
                    </div>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
