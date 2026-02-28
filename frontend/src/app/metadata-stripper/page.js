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

export default function MetadataStripper() {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleStrip = async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/api/image/strip-metadata`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText || 'Server error' }; }
                throw new Error(errData.error || 'Failed to strip metadata');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const cleanSize = parseInt(response.headers.get('X-Clean-Size'));
            let metaSummary = {};
            try { metaSummary = JSON.parse(response.headers.get('X-Meta-Summary') || '{}'); } catch (e) { }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                originalSize,
                cleanSize,
                metaSummary,
                filename: `clean-${file.name}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>🛡️</div>
                    <h1>Metadata Stripper</h1>
                    <p>Remove EXIF data, GPS location, camera info & hidden metadata from images</p>
                </div>

                {/* Privacy warning */}
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 18px', borderRadius: 12,
                    background: 'var(--error-light)', border: '1px solid rgba(239,68,68,0.15)',
                    marginBottom: 24, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55,
                }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                    <div>
                        <strong style={{ color: 'var(--error)', display: 'block', marginBottom: 2 }}>
                            Did you know?
                        </strong>
                        Photos from your phone contain hidden GPS coordinates, camera model, timestamp, and more.
                        Sharing them online can expose your exact location and identity.
                    </div>
                </div>

                <FileUploader
                    accept="image/jpeg,image/png,image/webp,image/tiff"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                />

                {file && !result && (
                    <div className="controls">
                        <button className="btn-primary" onClick={handleStrip} disabled={processing}>
                            {processing ? '⏳ Stripping Metadata...' : '🛡️ Strip All Metadata'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '70%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" /> Removing hidden data from your image...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ Metadata Removed</h3>

                        {/* Show what was found & removed */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: 8, marginBottom: 18,
                        }}>
                            {[
                                { label: 'EXIF Data', found: result.metaSummary.hasExif, icon: '📷' },
                                { label: 'ICC Profile', found: result.metaSummary.hasIcc, icon: '🎨' },
                                { label: 'XMP Data', found: result.metaSummary.hasXmp, icon: '📝' },
                                { label: 'GPS Location', found: result.metaSummary.hasExif, icon: '📍' },
                            ].map((item) => (
                                <div key={item.label} style={{
                                    padding: '10px 12px', borderRadius: 10,
                                    background: item.found ? 'var(--success-light)' : 'var(--bg-surface-secondary)',
                                    border: `1px solid ${item.found ? 'var(--shield-border)' : 'var(--border-primary)'}`,
                                    textAlign: 'center', fontSize: '0.78rem',
                                }}>
                                    <div style={{ fontSize: '1rem', marginBottom: 4 }}>{item.icon}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                                    <div style={{ color: item.found ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 600, marginTop: 2 }}>
                                        {item.found ? '✓ Removed' : '— Not found'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Before</div>
                                <div className="result-stat-value">{formatSize(result.originalSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">After</div>
                                <div className="result-stat-value">{formatSize(result.cleanSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Resolution</div>
                                <div className="result-stat-value" style={{ fontSize: '0.85rem' }}>
                                    {result.metaSummary.width}×{result.metaSummary.height}
                                </div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download Clean Image
                        </button>
                    </div>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
