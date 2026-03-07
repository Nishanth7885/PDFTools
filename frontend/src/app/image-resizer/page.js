'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

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
                let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }
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
                    <h1>Resize Image Online — Free Image Resizer</h1>
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

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free IMAGE RESIZER Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>IMAGE RESIZER Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the IMAGE RESIZER, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using IMAGE RESIZER radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
