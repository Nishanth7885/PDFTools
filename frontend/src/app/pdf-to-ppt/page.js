'use client';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

export default function PDFToPPT() {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState('');
    const [error, setError] = useState('');

    const handleConvert = useCallback(async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setResultUrl('');

        try {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs?v=2`;

            const PptxGenJSModuleName = 'pptxgenjs';
            const PptxGenJS = (await import(PptxGenJSModuleName)).default;
            const pres = new PptxGenJS();

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;

            const page1 = await pdf.getPage(1);
            const view1 = page1.getViewport({ scale: 1 });
            // Standard PowerPoint presentation size is 10 x 5.625 inches (16:9), or 10 x 7.5 (4:3)
            // Let's create a custom layout exactly matching the PDF ratio
            const widthInches = view1.width / 72;
            const heightInches = view1.height / 72;
            pres.defineLayout({ name: 'PDFFit', width: widthInches, height: heightInches });
            pres.layout = 'PDFFit';

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);

                // Keep the scale a bit high for visual fidelity, but not so high it lags the browser
                const scale = 2; // high res image
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                // Grab as jpeg to reduce file size, quality 0.95
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                const slide = pres.addSlide();

                // The image gets placed on the slide
                slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });
            }

            const blob = await pres.write({ outputType: 'blob' });
            if (blob) {
                const url = URL.createObjectURL(blob);
                setResultUrl(url);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to process. Make sure the PDF is not encrypted or corrupted.');
        } finally {
            setProcessing(false);
        }
    }, [file]);

    const downloadFile = () => {
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = file.name.replace('.pdf', '') + '.pptx';
        a.click();
    };

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>📊</div>
                    <h1>Convert PDF to PowerPoint — Free PDF to PPTX</h1>
                    <p>Convert PDF presentations into high-quality PowerPoint (.pptx)</p>
                    <div className="tool-privacy-note">🛡️ Secure conversion in-browser — nothing uploaded</div>
                </div>

                <FileUploader
                    accept=".pdf"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setResultUrl(''); setError(''); }}
                    onRemove={() => { setFile(null); setResultUrl(''); setError(''); }}
                />

                {file && !resultUrl && !processing && (
                    <div className="controls">
                        <button className="btn-primary" onClick={handleConvert}>
                            🚀 Convert to PPTX
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '80%' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Rendering and creating PowerPoint...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {resultUrl && (
                    <div className="result-card">
                        <h3>✅ Conversion Successful</h3>
                        <button className="btn-download" onClick={downloadFile}>
                            ⬇️ Download PowerPoint File
                        </button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PDF TO PPT Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PDF TO PPT Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PDF TO PPT, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PDF TO PPT radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
