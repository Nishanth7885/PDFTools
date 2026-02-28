const fs = require('fs');
let lines = fs.readFileSync('controllers/pdfController.js', 'utf8').split(/\r?\n/);

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
            const { doc, bytes } = await robustLoad(inputPath);
            doc.setTitle(''); doc.setAuthor(''); doc.setSubject('');
            const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
            fs.writeFileSync(outPath, out); cleanup(inputPath);
            sendFile(res, outPath, path.basename(outPath), { 'X-Original-Size': originalSize, 'X-Compressed-Size': out.length });
        }
    } catch (e) { 
        cleanup(req.file?.path); 
        console.error("Compression error:", e);
        res.status(500).json({ error: e.message.includes('Ghostscript') ? 'Ghostscript is not installed. Please install it to use robust PDF compression.' : e.message }); 
    }
};`;

lines.splice(58, 14, newCompress);
fs.writeFileSync('controllers/pdfController.js', lines.join('\n'));
console.log('Done replacement by lines');
