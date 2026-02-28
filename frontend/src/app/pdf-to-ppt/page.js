'use client';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';

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
                    <h1>PDF to PPT</h1>
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
            </div>
            <Footer />
        </>
    );
}
