const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const {
    Document, Packer, Paragraph, TextRun,
    HeadingLevel, AlignmentType,
} = require('docx');

// ──────────────────────────────────────
//  PDF → Word (.docx)
// ──────────────────────────────────────
exports.pdfToWord = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const pdfBuffer = fs.readFileSync(inputPath);
        const originalSize = pdfBuffer.length;

        // Extract text from PDF
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text || '';

        if (!text.trim()) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({
                error: 'Could not extract text from this PDF. It may be image-based or encrypted.',
            });
        }

        // Split into paragraphs and build Word document
        const paragraphs = text
            .split(/\n\s*\n/) // double-newline = paragraph break
            .filter(p => p.trim())
            .map(p => {
                const trimmed = p.trim();
                // Heuristic: short ALL-CAPS line → heading
                const isHeading = trimmed.length < 120
                    && trimmed === trimmed.toUpperCase()
                    && /[A-Z]/.test(trimmed);

                return new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmed.replace(/\s+/g, ' '),
                            bold: isHeading,
                            size: isHeading ? 28 : 22,    // half-points
                            font: 'Calibri',
                        }),
                    ],
                    heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
                    spacing: { after: 200 },
                });
            });

        // Title paragraph
        const baseName = path.basename(req.file.originalname, '.pdf');
        paragraphs.unshift(
            new Paragraph({
                children: [
                    new TextRun({ text: baseName, bold: true, size: 36, font: 'Calibri' }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 400 },
                alignment: AlignmentType.CENTER,
            }),
        );

        const doc = new Document({
            sections: [{ properties: {}, children: paragraphs }],
        });

        const docxBuffer = await Packer.toBuffer(doc);
        const outputFilename = `${baseName}.docx`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);
        fs.writeFileSync(outputPath, docxBuffer);
        fs.unlinkSync(inputPath);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        );
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Converted-Size', docxBuffer.length);
        res.setHeader('X-Page-Count', pdfData.numpages || 0);
        res.setHeader(
            'Access-Control-Expose-Headers',
            'X-Original-Size, X-Converted-Size, X-Page-Count',
        );

        const stream = fs.createReadStream(outputPath);
        stream.pipe(res);
        stream.on('end', () => setTimeout(() => fs.unlink(outputPath, () => { }), 5000));
    } catch (err) {
        console.error('PDF→Word error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Conversion failed: ' + err.message });
    }
};

// ──────────────────────────────────────
//  Word (.docx) → PDF
// ──────────────────────────────────────
exports.wordToPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const originalSize = fs.statSync(inputPath).size;

        // Convert .docx → structured HTML via mammoth
        const result = await mammoth.convertToHtml({ path: inputPath });
        const html = result.value;

        if (!html || !html.trim()) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({ error: 'Could not read content from this document.' });
        }

        // Parse HTML into simple elements for PDFKit rendering
        const elements = parseHtmlElements(html);

        const baseName = path.basename(req.file.originalname).replace(/\.\w+$/, '');
        const outputFilename = `${baseName}.pdf`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        // Create PDF with PDFKit
        await new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 60, bottom: 60, left: 55, right: 55 },
                info: { Title: baseName, Producer: 'PDFtools' },
                autoFirstPage: true,
                bufferPages: true,
            });

            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

            for (const el of elements) {
                // Check if we need a new page
                if (doc.y > doc.page.height - doc.page.margins.bottom - 40) {
                    doc.addPage();
                }

                switch (el.tag) {
                    case 'h1':
                        doc.fontSize(22).font('Helvetica-Bold')
                            .text(el.text, { width: pageWidth, align: 'left' });
                        doc.moveDown(0.6);
                        break;

                    case 'h2':
                        doc.fontSize(18).font('Helvetica-Bold')
                            .text(el.text, { width: pageWidth, align: 'left' });
                        doc.moveDown(0.5);
                        break;

                    case 'h3':
                        doc.fontSize(15).font('Helvetica-Bold')
                            .text(el.text, { width: pageWidth, align: 'left' });
                        doc.moveDown(0.4);
                        break;

                    case 'li':
                        doc.fontSize(11).font('Helvetica')
                            .text(`•  ${el.text}`, {
                                width: pageWidth - 20,
                                indent: 15,
                            });
                        doc.moveDown(0.2);
                        break;

                    case 'p':
                    default:
                        if (el.bold) {
                            doc.fontSize(11).font('Helvetica-Bold')
                                .text(el.text, { width: pageWidth });
                        } else {
                            doc.fontSize(11).font('Helvetica')
                                .text(el.text, { width: pageWidth, lineGap: 3 });
                        }
                        doc.moveDown(0.4);
                        break;
                }
            }

            doc.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const convertedSize = fs.statSync(outputPath).size;
        fs.unlinkSync(inputPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Converted-Size', convertedSize);
        res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Converted-Size');

        const stream = fs.createReadStream(outputPath);
        stream.pipe(res);
        stream.on('end', () => setTimeout(() => fs.unlink(outputPath, () => { }), 5000));
    } catch (err) {
        console.error('Word→PDF error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Conversion failed: ' + err.message });
    }
};

// ──────────────────────────────────────
//  Utility: parse mammoth HTML into
//  simple element list for PDFKit
// ──────────────────────────────────────
function parseHtmlElements(html) {
    const elements = [];
    // Strip tags but keep structure
    const tagRe = /<(\/?)(\w+)[^>]*>([\s\S]*?)(?=<\/?\w|$)/g;

    // Simple approach: split by block-level tags
    const blockRe = /<(h[1-6]|p|li|tr|blockquote)([^>]*)>([\s\S]*?)<\/\1>/gi;
    let match;

    while ((match = blockRe.exec(html)) !== null) {
        const tag = match[1].toLowerCase();
        const inner = match[3];
        // Strip all inner HTML tags to get plain text
        const text = inner
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();

        if (!text) continue;

        const isBold = /<strong|<b[ >]/i.test(inner);
        elements.push({ tag, text, bold: isBold });
    }

    // Fallback: if no block elements found, treat as raw text
    if (elements.length === 0) {
        const rawText = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, ' ')
            .trim();

        if (rawText) {
            rawText.split(/\n\s*\n/).filter(Boolean).forEach(para => {
                elements.push({ tag: 'p', text: para.trim(), bold: false });
            });
        }
    }

    return elements;
}
