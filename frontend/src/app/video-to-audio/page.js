'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const audioFormats = [
    { value: 'mp3', label: 'MP3 — Universal, small size' },
    { value: 'aac', label: 'AAC — High quality, compact' },
    { value: 'wav', label: 'WAV — Lossless, uncompressed' },
    { value: 'ogg', label: 'OGG — Open source, good quality' },
    { value: 'flac', label: 'FLAC — Lossless, compressed' },
    { value: 'opus', label: 'OPUS — Modern, efficient' },
];

const bitrates = [
    { value: '64', label: '64 kbps — Low (small file)' },
    { value: '128', label: '128 kbps — Standard' },
    { value: '192', label: '192 kbps — High quality' },
    { value: '256', label: '256 kbps — Very high' },
    { value: '320', label: '320 kbps — Maximum' },
];

export default function VideoToAudio() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('mp3');
    const [bitrate, setBitrate] = useState('192');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const isLossless = ['wav', 'flac'].includes(format);

    const handleConvert = async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        if (!isLossless) formData.append('bitrate', bitrate);

        try {
            const response = await fetch(`${API_URL}/api/media/video-to-audio`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
                throw new Error(errData.error || 'Conversion failed');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const outputSize = parseInt(response.headers.get('X-Output-Size'));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const baseName = file.name.replace(/\.\w+$/, '');

            setResult({
                url,
                originalSize,
                outputSize,
                filename: `${baseName}.${format}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>🎬</div>
                    <h1>Extract Audio from Video — Free Video to Audio Converter</h1>
                    <p>Extract audio from any video file — MP4, MKV, AVI, MOV, WebM & more</p>
                </div>

                <FileUploader
                    accept="video/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.wmv,.3gp"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                    maxSizeMB={500}
                />

                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Output Format</label>
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                {audioFormats.map((f) => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>

                        {!isLossless && (
                            <div className="control-group">
                                <label>Bitrate</label>
                                <select value={bitrate} onChange={(e) => setBitrate(e.target.value)}>
                                    {bitrates.map((b) => (
                                        <option key={b.value} value={b.value}>{b.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {isLossless && (
                            <div className="control-group">
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    ℹ️ {format.toUpperCase()} is lossless — bitrate is automatic
                                </span>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleConvert}
                            disabled={processing}
                        >
                            {processing ? '⏳ Extracting Audio...' : '🚀 Extract Audio'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '60%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Extracting audio from video... This may take a moment for large files.
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ Audio Extracted</h3>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Video Size</div>
                                <div className="result-stat-value">{formatSize(result.originalSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Audio Size</div>
                                <div className="result-stat-value">{formatSize(result.outputSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Format</div>
                                <div className="result-stat-value">{format.toUpperCase()}</div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download {result.filename}
                        </button>
                    </div>
                )}

                <AdSense />

                <SeoContent>
                    <h2>How to Extract Audio from Video for Free</h2>
                    <p>Upload any video file and extract just the audio track as a separate audio file. Choose your preferred output format and bitrate. Our FFmpeg-powered engine handles all major video formats.</p>
                    <p><strong>Supported:</strong> Input: MP4, MKV, AVI, MOV, WebM. Output: MP3, WAV, AAC, OGG, FLAC, OPUS, M4A. Adjustable bitrate from 64kbps to 320kbps.</p>
                    <p>Free forever with no signup and no limits. Safe File Converter processes and deletes your video immediately.</p>
                </SeoContent>
            </div>
            <Footer />
        </>
    );
}
