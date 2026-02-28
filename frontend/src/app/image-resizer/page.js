'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleResize = async () => {
        if (!file) return;
        if (!width && !height) {
            setError('Please enter at least a width or height');
            return;
        }
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        if (width) formData.append('width', width);
        if (height) formData.append('height', height);
        formData.append('maintainAspect', maintainAspect.toString());

        try {
            const response = await fetch(`${API_URL}/api/image/resize`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText || 'Server error' }; }
                throw new Error(errData.error || 'Resize failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                filename: `resized-${file.name}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>📐</div>
                    <h1>Image Resizer</h1>
                    <p>Resize images to exact dimensions or scale proportionally</p>
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
                            <label>Dimensions (px)</label>
                            <div className="control-row">
                                <input
                                    type="number"
                                    placeholder="Width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    min="1"
                                    max="10000"
                                />
                                <input
                                    type="number"
                                    placeholder="Height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    min="1"
                                    max="10000"
                                />
                            </div>
                        </div>

                        <div className="control-group">
                            <label
                                className="checkbox-group"
                                onClick={() => setMaintainAspect(!maintainAspect)}
                            >
                                <input
                                    type="checkbox"
                                    checked={maintainAspect}
                                    onChange={(e) => setMaintainAspect(e.target.checked)}
                                />
                                <span>Maintain aspect ratio</span>
                            </label>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleResize}
                            disabled={processing}
                        >
                            {processing ? '⏳ Resizing...' : '🚀 Resize Image'}
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
                            Resizing your image...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

                {result && (
                    <div className="result-card">
                        <h3>✅ Resize Complete</h3>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download Resized Image
                        </button>
                    </div>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
