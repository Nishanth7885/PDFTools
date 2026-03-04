'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function PDFCompressor() {
    const [file, setFile] = useState(null);
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

        try {
            const response = await fetch(`${API_URL}/api/pdf/compress`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch (e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
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
                filename: `compressed-${file.name}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>📄</div>
                    <h1>Compress PDF Online — Free PDF Compressor</h1>
                    <p>Reduce your PDF file size by up to 80% while keeping quality intact</p>
                    <div className="tool-privacy-note">🛡️ Your file is never stored</div>
                </div>

                <FileUploader
                    accept=".pdf"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                />

                {file && !result && (
                    <div className="controls">
                        <button
                            className="btn-primary"
                            onClick={handleCompress}
                            disabled={processing}
                        >
                            {processing ? '⏳ Compressing...' : '🚀 Compress PDF'}
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
                            Processing your PDF...
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
                            ⬇️ Download Compressed PDF
                        </button>
                    </div>
                )}

                <AdSense />

                <SeoContent>
                    <h2>How Our Free PDF Compressor Works</h2>
                    <p>Our PDF compressor uses advanced Ghostscript-powered optimization to dramatically reduce PDF file sizes without visible quality loss. Whether you need to compress a PDF for email attachments, website uploads, or simply to save storage space, our tool handles it all.</p>
                    <p>Supported input: Any standard PDF file up to 50MB. The compression engine optimizes embedded images, removes redundant data, and streamlines the internal structure while preserving text clarity, vector graphics, and document layout.</p>
                    <p><strong>Common use cases:</strong> Shrinking large PDF reports for email, compressing scanned documents, reducing textbook PDFs for mobile devices, and preparing files for online form submissions with file size restrictions.</p>
                    <p>Unlike other tools, Safe File Converter is 100% free with no signup, no watermarks, and no daily limits. Your files are processed securely and deleted immediately after download.</p>
                </SeoContent>
            </div>
            <Footer />
        </>
    );
}
