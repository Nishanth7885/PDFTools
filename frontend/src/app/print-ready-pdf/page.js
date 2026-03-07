'use client';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PrintReadyPDF() {
    const [file, setFile] = useState(null);
    const [dpi, setDpi] = useState(300);
    const [cmyk, setCmyk] = useState(true);
    const [bleed, setBleed] = useState(0); // in points. 1/8 inch bleed = 9 points

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleProcess = useCallback(async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('dpi', dpi);
            formData.append('cmyk', cmyk);
            formData.append('bleed', bleed);

            const response = await fetch(`${API_URL}/api/pdf/print-ready`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch (e) { errData = { error: 'Failed to process file' }; }
                throw new Error(errData.error || 'Server error processing file');
            }

            const blob = await response.blob();
            const headers = response.headers;

            const originalSize = parseInt(headers.get('x-original-size') || '0', 10);
            const newSize = parseInt(headers.get('x-output-size') || '0', 10);
            const isCmyk = headers.get('x-cmyk-processed') === 'true';

            setResult({
                url: URL.createObjectURL(blob),
                filename: `Print-Ready-${file.name}`,
                originalSize,
                newSize,
                isCmyk,
                dpi: parseInt(headers.get('x-dpi-processed') || dpi, 10),
            });
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to process file for print.');
        } finally {
            setUploading(false);
        }
    }, [file, dpi, cmyk, bleed]);

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(56, 189, 248, 0.08)' }}>🖨️</div>
                    <h1>Print-Ready PDF Converter — Free CMYK, 300 DPI, Bleed</h1>
                    <p>Prepare designs for professional printing. Convert to CMYK, upscale downsampled images to 300 DPI, and automatically add bleed margins.</p>
                    <div className="tool-privacy-note">🛡️ Files are processed and immediately deleted. Zero data retention.</div>
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
                            <label>Color Profile</label>
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={cmyk}
                                    onChange={(e) => setCmyk(e.target.checked)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                <span>Convert RGB to CMYK (Recommended for Print)</span>
                            </label>
                        </div>

                        <div className="control-group">
                            <label>Image Resolution</label>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="72"
                                    max="600"
                                    step="12"
                                    value={dpi}
                                    onChange={(e) => setDpi(parseInt(e.target.value))}
                                />
                                <span className="slider-value">{dpi} DPI</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 6 }}>Ensures no image falls below this quality threshold.</p>
                        </div>

                        <div className="control-group">
                            <label>Bleed Margins (Points)</label>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="0"
                                    max="36"
                                    step="1"
                                    value={bleed}
                                    onChange={(e) => setBleed(parseInt(e.target.value))}
                                />
                                <span className="slider-value">{bleed} pts</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 6 }}>Add safety margins around the document. (9 pts = 0.125 inches).</p>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleProcess}
                            disabled={uploading}
                            style={{ width: '100%', marginTop: 24 }}
                        >
                            {uploading ? '⏳ Processing Print Profile...' : '⚙️ Generate Print-Ready PDF'}
                        </button>
                    </div>
                )}

                {uploading && (
                    <div style={{ marginTop: 24 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '100%', animation: 'loading 2s infinite linear' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Preflighting and converting colorspaces...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {result && (
                    <div className="result-card">
                        <h3>✅ Preflight Complete</h3>
                        <div className="stats-row" style={{ marginTop: 16 }}>
                            <div className="stat"><span>Color Space</span><strong>{result.isCmyk ? 'CMYK' : 'RGB / Original'}</strong></div>
                            <div className="stat"><span>Resolution</span><strong>{result.dpi} DPI</strong></div>
                            <div className="stat"><span>New Size</span><strong>{formatSize(result.newSize)}</strong></div>
                        </div>

                        <a href={result.url} download={result.filename} className="btn-download" style={{ marginTop: 20 }}>
                            ⬇️ Download Print-Ready PDF
                        </a>
                        <button className="btn-secondary" onClick={() => { setFile(null); setResult(null); }} style={{ width: '100%', marginTop: 12 }}>
                            Process another file
                        </button>
                    </div>
                )}

                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PRINT READY PDF Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PRINT READY PDF Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PRINT READY PDF, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PRINT READY PDF radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
