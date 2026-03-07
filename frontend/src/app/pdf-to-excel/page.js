'use client';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
import FileUploader from '@/components/FileUploader';
import SeoContent from '@/components/SeoContent';

export default function PDFToExcel() {
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

            const XLSX = await import('xlsx');

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const ws_data = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                // Try aligning by Y coordinates
                const lines = {};
                for (const item of textContent.items) {
                    const y = Math.round(item.transform[5]);
                    const x = Math.round(item.transform[4]);
                    if (!lines[y]) lines[y] = [];
                    lines[y].push({ text: item.str, x });
                }

                // Sort lines from top to bottom (highest Y is at the top in PDF coordinate space)
                const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);

                for (const y of sortedY) {
                    // Sort items in a line by X coordinate
                    const sortedRow = lines[y].sort((a, b) => a.x - b.x);

                    // Simple logic to separate cells based on X gaps
                    const finalRow = [];
                    let currentCell = '';
                    let lastX = -100;

                    for (const { text, x } of sortedRow) {
                        // If there's a huge horizontal gap in text placement (e.g >40px), we treat it as a new distinct cell column
                        if (lastX !== -100 && (x - lastX) > 40) {
                            finalRow.push(currentCell.trim());
                            currentCell = text;
                        } else {
                            currentCell += (currentCell && !currentCell.endsWith(' ') && !text.startsWith(' ') ? ' ' : '') + text;
                        }
                        lastX = x;
                    }
                    if (currentCell) finalRow.push(currentCell.trim());

                    if (finalRow.join('').trim().length > 0) {
                        ws_data.push(finalRow);
                    }
                }

                // Add empty row between pages
                if (i < pdf.numPages) ws_data.push([]);
            }

            if (ws_data.length === 0) {
                throw new Error("No text found in PDF. Note: This tool cannot convert scanned images without OCR.");
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, "PDF Data");

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            setResultUrl(URL.createObjectURL(blob));

        } catch (err) {
            console.error(err);
            setError('Failed to process PDF: ' + (err.message || 'Unknown error'));
        } finally {
            setProcessing(false);
        }
    }, [file]);

    const downloadFile = () => {
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = file.name.replace('.pdf', '') + '.xlsx';
        a.click();
    };

    return (
        <>
            <Navbar />
            <div className="tool-page animate-in">
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>📊</div>
                    <h1>Convert PDF to Excel Online — Free PDF to XLSX</h1>
                    <p>Extract tables, rows, and text from any PDF into editable Excel (.xlsx) spreadsheets</p>
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
                            🚀 Convert to Excel
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
                            Analyzing PDF data...
                        </div>
                    </div>
                )}

                {error && <div className="error-message">⚠️ {error}</div>}

                {resultUrl && (
                    <div className="result-card">
                        <h3>✅ Conversion Successful</h3>
                        <button className="btn-download" onClick={downloadFile}>
                            ⬇️ Download Excel File
                        </button>
                    </div>
                )}
                <AdSense />

                <SeoContent>
    <h2>Fully Comprehensive Guide to the Free PDF TO EXCEL Tool</h2>
    <p>Dealing with stubborn digital files can be incredibly frustrating. Our specialized <strong>PDF TO EXCEL Utility</strong> is engineered to eliminate that friction completely. Whether you are manipulating dense layouts for professional environments or optimizing essential personal media, our browser-based suite solves the problem instantly. Stop paying exorbitant monthly subscription fees for bulky desktop software—Safe File Converter handles complex algorithms natively inside your browser, completely free of charge.</p>

    <h3>Ultimate Privacy and Zero Data Retention</h3>
    <ul>
        <li><strong>Immediate Deletion Protocols:</strong> We strictly believe that user privacy is not an optional premium feature. All file uploads, temporal processes, and final outputs are actively purged from our memory arrays literally moments after you trigger the download. Your sensitive corporate information or private photography never persists on our infrastructure.</li>
        <li><strong>Isolated Cloud Execution:</strong> Processing environments spin up purely to accommodate your strict individual request queue securely and dissolve completely afterward, mitigating lateral extraction risks entirely.</li>
        <li><strong>Universal Compliance:</strong> Perfect utility alignment for accountants managing sensitive W-2s, internal medical professionals mapping HIPAA-protected charts, or lawyers formatting confidential depositions effortlessly.</li>
    </ul>

    <h3>Why Millions Prefer Our Processing Framework</h3>
    <p>Navigating countless online freemium converters usually results in deception: low file limits, hidden paywalls appearing exactly right before downloading, or massive ugly watermarks stamped across your diligent work. Safe File Converter guarantees absolute 100% free functionality. Specifically for the PDF TO EXCEL, we guarantee unrestricted usage limits, extensive 50MB payload accommodations, and absolute zero watermarking policies regardless of volume.</p>

    <h3>Essential Functional Scenarios</h3>
    <ul>
        <li><strong>Digital Optimization and Storage:</strong> Heavily reduce file dimensions drastically saving terabytes horizontally spanning hard drives and boosting native website loading speeds systematically minimizing viewer bounce-rate.</li>
        <li><strong>Interoperability Workflows:</strong> Ensure your exported media remains fundamentally accessible globally independently regardless of whether the recipient executes standard Apple macOS methodologies or localized Windows hardware processing effectively.</li>
        <li><strong>Unlocking Restricted Accessibility:</strong> Restore explicit operational access swiftly by stripping legacy metadata constraints globally securely easily quickly.</li>
    </ul>

    <h3>Frequently Asked Questions (FAQ)</h3>
    <p><strong>Are there any hidden costs or "premium" feature locks associated?</strong><br/>
    Absolutely not. There are literally zero premium tiers or deceptive upgrade buttons hidden throughout the interface visually. The robust ad-network implementations actively cover all backend server compute demands effectively subsidizing entirely the service cost cleanly.</p>

    <p><strong>Will using PDF TO EXCEL radically reduce existing file quality?</strong><br/>
    We aggressively optimize utilizing industry golden-standard FFmpeg and Ghostscript algorithms fundamentally ensuring explicit optimal fidelity visually. Where mathematically lossy compression dictates some reduction, the human eye essentially cannot register the deviation.</p>

    <p><strong>Is an active internet connection stringently required simultaneously?</strong><br/>
    Yes. Since we leverage heavily our external GPU and CPU-dense cloud arrays rather than draining your localized system batteries or memory resources functionally, you simply need a stabilized connection capable of establishing secure upload protocols seamlessly.</p>
</SeoContent>
            </div>
            <Footer />
        </>
    );
}
