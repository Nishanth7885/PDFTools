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
                    <h2>How Our Free PDF to Excel Converter Works</h2>
                    <p>This tool intelligently scans each page of your PDF and extracts text by analyzing horizontal and vertical positioning to reconstruct rows and columns. The result is a clean .xlsx spreadsheet that preserves your table structure.</p>
                    <p><strong>Supported formats:</strong> Any text-based PDF file. Works best with invoices, financial statements, reports, price lists, and any document with tabular data. Note: scanned image-based PDFs require OCR and are not yet supported.</p>
                    <p><strong>Privacy-first:</strong> Your PDF is converted entirely inside your browser. Nothing is uploaded to any server. This is a 100% client-side conversion — your data never leaves your device.</p>
                    <p>Safe File Converter offers this tool completely free with no signup, no watermarks, and no daily conversion limits. Perfect for accountants, students, researchers, and anyone who needs editable data from a PDF.</p>
                </SeoContent>
            </div>
            <Footer />
        </>
    );
}
