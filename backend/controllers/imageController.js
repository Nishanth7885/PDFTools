const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

exports.compressImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const quality = parseInt(req.body.quality) || 70;
        const originalSize = fs.statSync(inputPath).size;

        const outputFilename = `compressed-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        await sharp(inputPath)
            .jpeg({ quality, mozjpeg: true })
            .toFile(outputPath);

        const compressedSize = fs.statSync(outputPath).size;

        // Clean up input
        fs.unlinkSync(inputPath);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Compressed-Size', compressedSize);
        res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Compressed-Size');

        const fileStream = fs.createReadStream(outputPath);
        fileStream.pipe(res);
        fileStream.on('end', () => {
            setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
        });

    } catch (error) {
        console.error('Image compression error:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to compress image: ' + error.message });
    }
};

exports.resizeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const width = parseInt(req.body.width) || null;
        const height = parseInt(req.body.height) || null;
        const maintainAspect = req.body.maintainAspect !== 'false';
        const targetSizeKB = parseInt(req.body.targetSizeKB) || null;
        const originalSize = fs.statSync(inputPath).size;

        if (!width && !height && !targetSizeKB) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({ error: 'Width, height, or target file size is required' });
        }

        const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
        const outputFilename = `resized-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        const resizeOptions = {};
        if (width) resizeOptions.width = width;
        if (height) resizeOptions.height = height;
        if (!maintainAspect) {
            resizeOptions.fit = 'fill';
        } else {
            resizeOptions.fit = 'inside';
            resizeOptions.withoutEnlargement = false;
        }

        if (targetSizeKB) {
            // Iteratively reduce quality to hit the target file size
            const targetBytes = targetSizeKB * 1024;
            let quality = 95;
            let outputSize = Infinity;
            let attempts = 0;

            while (outputSize > targetBytes && quality > 5 && attempts < 15) {
                let pipeline = sharp(inputPath);
                if (width || height) pipeline = pipeline.resize(resizeOptions);
                await pipeline.jpeg({ quality, mozjpeg: true }).toFile(outputPath);
                outputSize = fs.statSync(outputPath).size;

                if (outputSize > targetBytes) {
                    // Reduce quality proportionally
                    const ratio = targetBytes / outputSize;
                    quality = Math.max(5, Math.floor(quality * Math.min(ratio, 0.85)));
                }
                attempts++;
            }
        } else {
            // Standard resize
            let pipeline = sharp(inputPath);
            if (width || height) pipeline = pipeline.resize(resizeOptions);
            await pipeline.jpeg({ quality: 90, mozjpeg: true }).toFile(outputPath);
        }

        const outputSize = fs.statSync(outputPath).size;
        fs.unlinkSync(inputPath);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Output-Size', outputSize);
        res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Output-Size');

        const fileStream = fs.createReadStream(outputPath);
        fileStream.pipe(res);
        fileStream.on('end', () => {
            setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
        });

    } catch (error) {
        console.error('Image resize error:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to resize image: ' + error.message });
    }
};

exports.convertImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const targetFormat = (req.body.format || 'png').toLowerCase();

        const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff', 'gif'];
        if (!supportedFormats.includes(targetFormat)) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({ error: `Unsupported format: ${targetFormat}. Supported: ${supportedFormats.join(', ')}` });
        }

        const actualFormat = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        const outputFilename = `converted-${Date.now()}.${ext}`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        let pipeline = sharp(inputPath);

        switch (actualFormat) {
            case 'jpeg':
                pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
                break;
            case 'png':
                pipeline = pipeline.png({ compressionLevel: 6 });
                break;
            case 'webp':
                pipeline = pipeline.webp({ quality: 85 });
                break;
            case 'avif':
                pipeline = pipeline.avif({ quality: 65 });
                break;
            case 'tiff':
                pipeline = pipeline.tiff({ compression: 'lzw' });
                break;
            case 'gif':
                pipeline = pipeline.gif();
                break;
        }

        await pipeline.toFile(outputPath);

        const mimeTypes = {
            'jpeg': 'image/jpeg', 'png': 'image/png',
            'webp': 'image/webp', 'avif': 'image/avif',
            'tiff': 'image/tiff', 'gif': 'image/gif',
        };

        fs.unlinkSync(inputPath);

        res.setHeader('Content-Type', mimeTypes[actualFormat] || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);

        const fileStream = fs.createReadStream(outputPath);
        fileStream.pipe(res);
        fileStream.on('end', () => {
            setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
        });

    } catch (error) {
        console.error('Image conversion error:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to convert image: ' + error.message });
    }
};

// ──────────────────────────────────────
//  Strip Image Metadata (EXIF, GPS, etc.)
// ──────────────────────────────────────
exports.stripMetadata = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const originalSize = fs.statSync(inputPath).size;

        // Read metadata before stripping
        const metadata = await sharp(inputPath).metadata();
        const metaSummary = {
            format: metadata.format || 'unknown',
            width: metadata.width,
            height: metadata.height,
            hasExif: metadata.exif ? true : false,
            hasIcc: metadata.icc ? true : false,
            hasXmp: metadata.xmp ? true : false,
            density: metadata.density || null,
            space: metadata.space || null,
        };

        const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
        const outputFilename = `clean-${Date.now()}${ext}`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        // Process: keep image quality but strip ALL metadata
        let pipeline = sharp(inputPath);

        switch (metadata.format) {
            case 'jpeg':
                pipeline = pipeline.jpeg({ quality: 100, mozjpeg: false });
                break;
            case 'png':
                pipeline = pipeline.png({ compressionLevel: 6 });
                break;
            case 'webp':
                pipeline = pipeline.webp({ quality: 95 });
                break;
            default:
                pipeline = pipeline.toFormat(metadata.format || 'jpeg');
        }

        // Do NOT call .withMetadata() - this strips all EXIF/ICC/XMP
        await pipeline.toFile(outputPath);

        const cleanSize = fs.statSync(outputPath).size;
        fs.unlinkSync(inputPath);

        const mimeTypes = {
            '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
            '.png': 'image/png', '.webp': 'image/webp',
            '.gif': 'image/gif', '.tiff': 'image/tiff',
            '.avif': 'image/avif',
        };

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Clean-Size', cleanSize);
        res.setHeader('X-Meta-Summary', JSON.stringify(metaSummary));
        res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Clean-Size, X-Meta-Summary');

        const stream = fs.createReadStream(outputPath);
        stream.pipe(res);
        stream.on('end', () => {
            setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
        });

    } catch (error) {
        console.error('Metadata strip error:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to strip metadata: ' + error.message });
    }
};
