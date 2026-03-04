'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const formats = [
    { value: 'png', label: 'PNG — Lossless, transparent' },
    { value: 'jpg', label: 'JPG — Small size, photos' },
    { value: 'webp', label: 'WebP — Modern, best balance' },
    { value: 'avif', label: 'AVIF — Next-gen, smallest' },
    { value: 'tiff', label: 'TIFF — Print quality' },
    { value: 'gif', label: 'GIF — Animation support' },
];

export default function ImageConverter() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('png');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleConvert = async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        try {
            const response = await fetch(`${API_URL}/api/image/convert`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
                throw new Error(errData.error || 'Conversion failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const baseName = file.name.replace(/\.\w+$/, '');
            const ext = format === 'jpeg' ? 'jpg' : format;

            setResult({
                url,
                filename: `${baseName}.${ext}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>🔄</div>
                    <h1>Convert Image Format Online — Free Image Converter</h1>
                    <p>Convert images between JPG, PNG, WebP, AVIF, TIFF, and GIF</p>
                    <div className="tool-privacy-note">🛡️ Your file is never stored</div>
                </div>

                <FileUploader
                    accept="image/*"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                />

                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Convert to</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                            >
                                {formats.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleConvert}
                            disabled={processing}
                        >
                            {processing ? '⏳ Converting...' : '🚀 Convert Image'}
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
                            Converting your image...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

                {result && (
                    <div className="result-card">
                        <h3>✅ Conversion Complete</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                            Converted to <strong>{format.toUpperCase()}</strong> format
                        </p>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download {result.filename}
                        </button>
                    </div>
                )}

                <AdSense />

                <SeoContent>
                    <h2>How to Convert Image Formats for Free</h2>
                    <p>Convert images between all major formats including JPG, PNG, WebP, AVIF, TIFF, and GIF. Our converter handles format-specific features like transparency (PNG), animation (GIF), and next-gen compression (WebP, AVIF).</p>
                    <p><strong>Common use cases:</strong> Converting HEIC/HEIF photos from iPhone, preparing WebP images for websites, converting PNG screenshots to JPG for smaller sizes, and creating AVIF images for optimal web performance.</p>
                    <p>Free forever, no signup, instant conversion. Safe File Converter processes and deletes your files immediately.</p>
                </SeoContent>
            </div>
            <Footer />
        </>
    );
}
