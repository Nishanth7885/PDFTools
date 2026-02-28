'use client';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';

export default function PDFToJPG() {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [pages, setPages] = useState([]);
    const [quality, setQuality] = useState(0.92);
    const [error, setError] = useState('');

    const handleConvert = useCallback(async () => {
        if (!file) return;
        setProcessing(true);
        setError('');
        setPages([]);

        try {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs?v=2`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;

            const renderedPages = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const scale = 2;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                await page.render({ canvasContext: ctx, viewport }).promise;

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                renderedPages.push({
                    pageNum: i,
                    dataUrl,
                    width: viewport.width,
                    height: viewport.height,
                });
            }

            setPages(renderedPages);
        } catch (err) {
            console.error(err);
            setError('Failed to process PDF: ' + (err.message || 'Unknown error'));
        } finally {
            setProcessing(false);
        }
    }, [file, quality]);

    const downloadPage = (page) => {
        const a = document.createElement('a');
        a.href = page.dataUrl;
        a.download = `${file.name.replace('.pdf', '')}-page-${page.pageNum}.jpg`;
        a.click();
    };

    const downloadAll = () => {
        pages.forEach((page, index) => {
            setTimeout(() => downloadPage(page), index * 200);
        });
    };

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>🖼️</div>
                    <h1>PDF to JPG</h1>
                    <p>Convert each PDF page to a high-quality JPG image</p>
                    <div className="tool-privacy-note">🛡️ Converted in-browser — nothing uploaded</div>
                </div>

                <FileUploader
                    accept=".pdf"
                    file={file}
                    onFileSelect={(f) => { setFile(f); setPages([]); setError(''); }}
                    onRemove={() => { setFile(null); setPages([]); setError(''); }}
                />

                {file && pages.length === 0 && (
                    <div className="controls">
                        <div className="control-group">
                            <label>JPG Quality</label>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                />
                                <span className="slider-value">{Math.round(quality * 100)}%</span>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleConvert}
                            disabled={processing}
                        >
                            {processing ? '⏳ Converting...' : '🚀 Convert to JPG'}
                        </button>
                    </div>
                )}

                {processing && (
                    <div style={{ marginTop: 16 }}>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: '60%' }} />
                        </div>
                        <div className="processing-text">
                            <div className="spinner" />
                            Rendering PDF pages...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

                {pages.length > 0 && (
                    <>
                        <div className="result-card">
                            <h3>✅ Converted {pages.length} page{pages.length > 1 ? 's' : ''}</h3>
                            <button className="btn-download" onClick={downloadAll}>
                                ⬇️ Download All Pages
                            </button>
                        </div>
                        <div className="pages-grid">
                            {pages.map((page) => (
                                <div key={page.pageNum} className="page-preview">
                                    <img src={page.dataUrl} alt={`Page ${page.pageNum}`} />
                                    <div className="page-preview-footer">
                                        <span>Page {page.pageNum}</span>
                                        <button
                                            className="page-download-btn"
                                            onClick={() => downloadPage(page)}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <AdSense />
            </div>
            <Footer />
        </>
    );
}
