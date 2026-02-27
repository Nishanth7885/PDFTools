'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';

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
    { value: 'm4a', label: 'M4A — Apple / iTunes standard' },
    { value: 'wav', label: 'WAV — Lossless, uncompressed' },
    { value: 'ogg', label: 'OGG Vorbis — Open source' },
    { value: 'flac', label: 'FLAC — Lossless, compressed' },
    { value: 'opus', label: 'OPUS — Modern, very efficient' },
];

const bitrates = [
    { value: '64', label: '64 kbps — Low' },
    { value: '96', label: '96 kbps — Medium-low' },
    { value: '128', label: '128 kbps — Standard' },
    { value: '192', label: '192 kbps — High' },
    { value: '256', label: '256 kbps — Very high' },
    { value: '320', label: '320 kbps — Maximum' },
];

const sampleRates = [
    { value: '', label: 'Original (keep source)' },
    { value: '22050', label: '22,050 Hz — Voice / Podcast' },
    { value: '44100', label: '44,100 Hz — CD Quality' },
    { value: '48000', label: '48,000 Hz — Studio Quality' },
];

export default function AudioConverter() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('mp3');
    const [bitrate, setBitrate] = useState('192');
    const [sampleRate, setSampleRate] = useState('');
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
        if (sampleRate) formData.append('sampleRate', sampleRate);

        try {
            const response = await fetch(`${API_URL}/api/media/audio-convert`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Conversion failed');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const outputSize = parseInt(response.headers.get('X-Output-Size'));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const baseName = file.name.replace(/\.\w+$/, '');
            const ext = format === 'm4a' ? 'm4a' : format;

            setResult({
                url,
                originalSize,
                outputSize,
                savings: originalSize > 0 ? Math.round((1 - outputSize / originalSize) * 100) : 0,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>🎵</div>
                    <h1>Audio Converter</h1>
                    <p>Convert between MP3, WAV, AAC, OGG, FLAC, M4A, and OPUS formats</p>
                </div>

                <FileUploader
                    accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.wma,.opus,.webm,.amr"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                    maxSizeMB={200}
                />

                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Convert to</label>
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

                        <div className="control-group">
                            <label>Sample Rate</label>
                            <select value={sampleRate} onChange={(e) => setSampleRate(e.target.value)}>
                                {sampleRates.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {isLossless && (
                            <div className="control-group">
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    ℹ️ {format.toUpperCase()} is lossless — bitrate is managed automatically
                                </span>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleConvert}
                            disabled={processing}
                        >
                            {processing ? '⏳ Converting...' : '🚀 Convert Audio'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Converting audio format...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ Conversion Complete</h3>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Before</div>
                                <div className="result-stat-value">{formatSize(result.originalSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">After</div>
                                <div className="result-stat-value">{formatSize(result.outputSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Difference</div>
                                <div className={`result-stat-value ${result.savings > 0 ? 'savings' : ''}`}>
                                    {result.savings > 0 ? `−${result.savings}%` : result.savings < 0 ? `+${Math.abs(result.savings)}%` : '—'}
                                </div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download {result.filename}
                        </button>
                    </div>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
