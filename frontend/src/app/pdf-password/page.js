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

export default function PDFPassword() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleProtect = async () => {
        if (!file) return;
        if (!password) {
            setError('Please enter a password');
            return;
        }
        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        setProcessing(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_URL}/api/pdf/protect`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText || 'Server error' }; }
                throw new Error(errData.error || 'Protection failed');
            }

            const originalSize = parseInt(response.headers.get('X-Original-Size'));
            const outputSize = parseInt(response.headers.get('X-Output-Size'));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                originalSize,
                outputSize,
                filename: `protected-${file.name}`,
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
                    <div className="tool-page-icon" style={{ background: 'rgba(99, 102, 241, 0.08)' }}>🔒</div>
                    <h1>PDF Password Protector</h1>
                    <p>Encrypt your PDF with a password to prevent unauthorized access</p>
                </div>

                <FileUploader
                    accept=".pdf"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResult(null); setError(''); }}
                    onRemove={() => { setFile(null); setResult(null); setError(''); }}
                />

                {file && !result && (
                    <div className="controls">
                        <div className="control-group">
                            <label>Set Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter a strong password..."
                                    style={{
                                        width: '100%', padding: '12px 48px 12px 14px',
                                        borderRadius: 10, border: '1px solid var(--border-primary)',
                                        background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)',
                                        fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-tertiary)', fontSize: '1rem',
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {password.length > 0 && password.length < 4 && (
                                <span style={{ fontSize: '0.76rem', color: 'var(--error)' }}>
                                    Password too short (min 4 characters)
                                </span>
                            )}
                        </div>

                        {/* Protection info */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                            fontSize: '0.78rem',
                        }}>
                            {[
                                { icon: '🔐', label: 'AES Encryption' },
                                { icon: '🚫', label: 'Copy disabled' },
                                { icon: '✏️', label: 'Edit disabled' },
                                { icon: '🖨️', label: 'Print allowed' },
                            ].map(item => (
                                <div key={item.label} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 14px', borderRadius: 10,
                                    background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-primary)',
                                }}>
                                    <span>{item.icon}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <button className="btn-primary" onClick={handleProtect} disabled={processing || password.length < 4}>
                            {processing ? '⏳ Encrypting...' : '🔒 Protect PDF'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '65%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" /> Encrypting your PDF...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ PDF Encrypted</h3>
                        <div className="result-stats">
                            <div className="result-stat">
                                <div className="result-stat-label">Original</div>
                                <div className="result-stat-value">{formatSize(result.originalSize)}</div>
                            </div>
                            <div className="result-stat">
                                <div className="result-stat-label">Protected</div>
                                <div className="result-stat-value">{formatSize(result.outputSize)}</div>
                            </div>
                        </div>
                        <button className="btn-download" onClick={handleDownload}>
                            ⬇️ Download Protected PDF
                        </button>
                        <p style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                            🔑 Remember your password — we don't store it and cannot recover it.
                        </p>
                    </div>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
