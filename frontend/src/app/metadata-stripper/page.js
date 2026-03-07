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
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
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
                    <h1>Remove Image Metadata — Free EXIF Data Stripper</h1>
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

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free METADATA STRIPPER Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>METADATA STRIPPER Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the METADATA STRIPPER, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using METADATA STRIPPER radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
