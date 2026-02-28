const fs = require('fs');
let code = fs.readFileSync('controllers/pdfController.js', 'utf8');

const oldCompress = `// ── Compress PDF ──
exports.compressPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { doc: pdfDoc, bytes: inputBytes } = await robustLoad(req.file.path);
        pdfDoc.setTitle(''); pdfDoc.setAuthor(''); pdfDoc.setSubject('');
        pdfDoc.setKeywords([]); pdfDoc.setProducer(''); pdfDoc.setCreator('');
        const out = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
        const outPath = path.join(__dirname, '..', 'output', \`compressed-\${Date.now()}.pdf\`);
        fs.writeFileSync(outPath, out); cleanup(req.file.path);
        sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': inputBytes.length, 'X-Compressed-Size': out.length });
    } catch (e) { cleanup(req.file?.path); res.status(500).json({ error: e.message.includes('expected pattern') ? 'This PDF is encrypted, corrupted, or unsupported.' : e.message }); }
};`;

const newCompress = `// ── Compress PDF (Ghostscript Robust) ──
exports.compressPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const inputPath = req.file.path;
        const outPath = path.join(__dirname, '..', 'output', \`compressed-\${Date.now()}.pdf\`);
        const originalSize = fs.statSync(inputPath).size;
        
        const gsSuccess = await tryGhostscriptCompress(inputPath, outPath);
        
        if (gsSuccess) {
            cleanup(inputPath);
            const compressedSize = fs.statSync(outPath).size;
            sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': originalSize, 'X-Compressed-Size': compressedSize });
        } else {
            // GS not installed or failed, fall back to simple pdf-lib saving
            const { doc, bytes } = await robustLoad(inputPath);
            doc.setTitle(''); doc.setAuthor(''); doc.setSubject('');
            const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
            fs.writeFileSync(outPath, out); cleanup(inputPath);
            sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': originalSize, 'X-Compressed-Size': out.length });
        }
    } catch (e) { 
        cleanup(req.file?.path); 
        res.status(500).json({ error: e.message.includes('Ghostscript') ? 'Ghostscript is not installed. Please install it to use robust PDF compression.' : e.message }); 
    }
};`;

code = code.replace(oldCompress, newCompress);
fs.writeFileSync('controllers/pdfController.js', code);
console.log('compressPDF upgraded!');
