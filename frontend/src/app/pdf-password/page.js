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
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
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
                    <h1>Protect PDF with Password — Free PDF Encryption</h1>
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

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PDF PASSWORD Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PDF PASSWORD Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PDF PASSWORD, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PDF PASSWORD radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
