const { PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const cleanup = (filePath) => { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); };
const sendFile = (res, outputPath, filename, headers) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    res.setHeader('Access-Control-Expose-Headers', Object.keys(headers).join(', '));
    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on('end', () => setTimeout(() => fs.unlink(outputPath, () => { }), 5000));
};

// ── Compress PDF ──
exports.compressPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const inputBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        pdfDoc.setTitle(''); pdfDoc.setAuthor(''); pdfDoc.setSubject('');
        pdfDoc.setKeywords([]); pdfDoc.setProducer(''); pdfDoc.setCreator('');
        const out = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
        const outPath = path.join(__dirname, '..', 'output', `compressed-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Compressed-Size': out.length });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Merge PDFs ──
exports.mergePDFs = async (req, res) => {
    const files = req.files || [];
    try {
        if (files.length < 2) { files.forEach(f => cleanup(f.path)); return res.status(400).json({ error: 'Upload at least 2 PDFs' }); }
        const merged = await PDFDocument.create();
        let totalSize = 0;
        for (const f of files) { const b = fs.readFileSync(f.path); totalSize += b.length; const d = await PDFDocument.load(b, { ignoreEncryption: true }); (await merged.copyPages(d, d.getPageIndices())).forEach(p => merged.addPage(p)); }
        const out = await merged.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `merged-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); files.forEach(f => cleanup(f.path));
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': totalSize, 'X-Output-Size': out.length, 'X-Page-Count': merged.getPageCount(), 'X-File-Count': files.length });
    } catch (e) { files.forEach(f => cleanup(f.path)); res.status(500).json({ error: e.message }); }
};

// ── Protect PDF ──
exports.protectPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const pw = req.body.password;
        if (!pw || pw.length < 1) { cleanup(req.file.path); return res.status(400).json({ error: 'Password required' }); }
        const inputBytes = fs.readFileSync(req.file.path);
        const doc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const out = await doc.save({ useObjectStreams: true, userPassword: pw, ownerPassword: pw, permissions: { printing: 'highResolution', modifying: false, copying: false, annotating: false, fillingForms: true, contentAccessibility: true, documentAssembly: false } });
        const outPath = path.join(__dirname, '..', 'output', `protected-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Split PDF ──
function parsePageRange(range, total) {
    const pages = new Set();
    range.split(',').map(s => s.trim()).forEach(part => {
        if (part.includes('-')) {
            const [a, b] = part.split('-').map(Number);
            for (let i = Math.max(1, a); i <= Math.min(total, b); i++) pages.add(i - 1);
        } else { const p = parseInt(part); if (p >= 1 && p <= total) pages.add(p - 1); }
    });
    return Array.from(pages).sort((a, b) => a - b);
}

exports.splitPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        if (!req.body.pages) { cleanup(req.file.path); return res.status(400).json({ error: 'Page range required (e.g. "1-3,5,8-10")' }); }
        const inputBytes = fs.readFileSync(req.file.path);
        const src = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const indices = parsePageRange(req.body.pages, src.getPageCount());
        if (!indices.length) { cleanup(req.file.path); return res.status(400).json({ error: `Invalid range. PDF has ${src.getPageCount()} pages.` }); }
        const doc = await PDFDocument.create();
        (await doc.copyPages(src, indices)).forEach(p => doc.addPage(p));
        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `split-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Original-Pages': src.getPageCount(), 'X-Extracted-Pages': indices.length });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Rotate PDF ──
exports.rotatePDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const angle = parseInt(req.body.angle) || 90;
        if (![90, 180, 270].includes(angle)) { cleanup(req.file.path); return res.status(400).json({ error: 'Angle must be 90, 180, or 270' }); }
        const inputBytes = fs.readFileSync(req.file.path);
        const doc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        doc.getPages().forEach(p => p.setRotation(degrees(p.getRotation().angle + angle)));
        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `rotated-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Page-Count': doc.getPageCount() });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Watermark PDF ──
exports.watermarkPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const text = req.body.text || 'CONFIDENTIAL';
        const opacity = parseFloat(req.body.opacity) || 0.15;
        const fontSize = parseInt(req.body.fontSize) || 48;
        const inputBytes = fs.readFileSync(req.file.path);
        const doc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        doc.getPages().forEach(page => {
            const { width, height } = page.getSize();
            page.drawText(text, { x: (width - font.widthOfTextAtSize(text, fontSize)) / 2, y: height / 2, size: fontSize, font, color: rgb(0.5, 0.5, 0.5), opacity, rotate: degrees(45) });
        });
        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `watermarked-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Page-Count': doc.getPageCount() });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── JPG/Images to PDF ──
exports.jpgToPDF = async (req, res) => {
    const files = req.files || [];
    try {
        if (!files.length) return res.status(400).json({ error: 'No images uploaded' });
        const doc = await PDFDocument.create();
        let totalSize = 0;
        for (const f of files) {
            const b = fs.readFileSync(f.path); totalSize += b.length;
            const img = path.extname(f.originalname).toLowerCase() === '.png' ? await doc.embedPng(b) : await doc.embedJpg(b);
            const page = doc.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `images-to-pdf-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); files.forEach(f => cleanup(f.path));
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': totalSize, 'X-Output-Size': out.length, 'X-Page-Count': doc.getPageCount(), 'X-File-Count': files.length });
    } catch (e) { files.forEach(f => cleanup(f.path)); res.status(500).json({ error: e.message }); }
};

// ── Unlock PDF (remove password) ──
exports.unlockPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const password = req.body.password || '';
        const inputBytes = fs.readFileSync(req.file.path);

        let doc;
        try {
            doc = await PDFDocument.load(inputBytes, { ignoreEncryption: true, password });
        } catch (loadErr) {
            cleanup(req.file.path);
            return res.status(400).json({ error: 'Wrong password or unsupported encryption' });
        }

        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `unlocked-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Page-Count': doc.getPageCount() });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Add Page Numbers ──
exports.addPageNumbers = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const position = req.body.position || 'bottom-center'; // bottom-center, bottom-right, bottom-left, top-center, top-right, top-left
        const format = req.body.format || 'page-of'; // page-of, number-only, dash
        const fontSize = parseInt(req.body.fontSize) || 11;

        const inputBytes = fs.readFileSync(req.file.path);
        const doc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const pages = doc.getPages();
        const total = pages.length;

        pages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            const num = idx + 1;

            let text;
            switch (format) {
                case 'number-only': text = `${num}`; break;
                case 'dash': text = `— ${num} —`; break;
                default: text = `Page ${num} of ${total}`;
            }

            const textWidth = font.widthOfTextAtSize(text, fontSize);
            let x, y;

            switch (position) {
                case 'bottom-left': x = 40; y = 30; break;
                case 'bottom-right': x = width - textWidth - 40; y = 30; break;
                case 'top-center': x = (width - textWidth) / 2; y = height - 35; break;
                case 'top-left': x = 40; y = height - 35; break;
                case 'top-right': x = width - textWidth - 40; y = height - 35; break;
                default: x = (width - textWidth) / 2; y = 30; break; // bottom-center
            }

            page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
        });

        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `numbered-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Page-Count': total });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── Organize PDF (reorder/remove pages) ──
exports.organizePDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const order = req.body.order; // e.g. "3,1,2,5" — new page order (1-indexed)
        if (!order) { cleanup(req.file.path); return res.status(400).json({ error: 'Page order required (e.g. "3,1,2,5")' }); }

        const inputBytes = fs.readFileSync(req.file.path);
        const src = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const totalPages = src.getPageCount();

        const indices = order.split(',').map(s => parseInt(s.trim()) - 1).filter(i => i >= 0 && i < totalPages);
        if (!indices.length) { cleanup(req.file.path); return res.status(400).json({ error: `Invalid order. PDF has ${totalPages} pages.` }); }

        const doc = await PDFDocument.create();
        const copied = await doc.copyPages(src, indices);
        copied.forEach(p => doc.addPage(p));

        const out = await doc.save({ useObjectStreams: true });
        const outPath = path.join(__dirname, '..', 'output', `organized-${Date.now()}.pdf`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Output-Size': out.length, 'X-Original-Pages': totalPages, 'X-New-Pages': indices.length });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message }); }
};

// ── HTML / Text to PDF ──
exports.htmlToPDF = async (req, res) => {
    try {
        const content = req.body.content;
        const title = req.body.title || '';
        if (!content || content.trim().length === 0) return res.status(400).json({ error: 'Content is required' });

        const PDFKitDoc = require('pdfkit');
        const outPath = path.join(__dirname, '..', 'output', `text-to-pdf-${Date.now()}.pdf`);
        const stream = fs.createWriteStream(outPath);

        const pdf = new PDFKitDoc({ size: 'A4', margins: { top: 60, bottom: 60, left: 55, right: 55 }, bufferPages: true });
        pdf.pipe(stream);

        // Title
        if (title.trim()) {
            pdf.font('Helvetica-Bold').fontSize(22).fillColor('#1a1a2e').text(title, { align: 'center' });
            pdf.moveDown(1.2);
            pdf.moveTo(55, pdf.y).lineTo(540, pdf.y).strokeColor('#e0e0e0').lineWidth(1).stroke();
            pdf.moveDown(0.8);
        }

        // Body — process line by line for simple formatting
        const lines = content.split('\n');
        pdf.font('Helvetica').fontSize(11).fillColor('#333333');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
                pdf.moveDown(0.5).font('Helvetica-Bold').fontSize(18).fillColor('#1a1a2e').text(trimmed.slice(2));
                pdf.moveDown(0.3).font('Helvetica').fontSize(11).fillColor('#333333');
            } else if (trimmed.startsWith('## ')) {
                pdf.moveDown(0.4).font('Helvetica-Bold').fontSize(15).fillColor('#2d2d44').text(trimmed.slice(3));
                pdf.moveDown(0.2).font('Helvetica').fontSize(11).fillColor('#333333');
            } else if (trimmed.startsWith('### ')) {
                pdf.moveDown(0.3).font('Helvetica-Bold').fontSize(13).fillColor('#3d3d55').text(trimmed.slice(4));
                pdf.moveDown(0.2).font('Helvetica').fontSize(11).fillColor('#333333');
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                pdf.text(`  •  ${trimmed.slice(2)}`, { lineGap: 3 });
            } else if (trimmed === '') {
                pdf.moveDown(0.5);
            } else {
                pdf.text(trimmed, { lineGap: 3 });
            }
        }

        pdf.end();

        stream.on('finish', () => {
            const outSize = fs.statSync(outPath).size;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="document-${Date.now()}.pdf"`);
            res.setHeader('X-Output-Size', outSize);
            res.setHeader('X-Page-Count', pdf.bufferedPageRange().count || 1);
            res.setHeader('Access-Control-Expose-Headers', 'X-Output-Size, X-Page-Count');
            const readStream = fs.createReadStream(outPath);
            readStream.pipe(res);
            readStream.on('end', () => setTimeout(() => fs.unlink(outPath, () => { }), 5000));
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
