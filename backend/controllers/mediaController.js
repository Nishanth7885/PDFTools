const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────
//  Video → Audio
// ──────────────────────────────────────
exports.videoToAudio = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const originalSize = fs.statSync(inputPath).size;
        const format = (req.body.format || 'mp3').toLowerCase();
        const bitrate = req.body.bitrate || '192';

        const supportedFormats = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'opus'];
        if (!supportedFormats.includes(format)) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({
                error: `Unsupported format: ${format}. Supported: ${supportedFormats.join(', ')}`,
            });
        }

        const baseName = path.basename(req.file.originalname).replace(/\.\w+$/, '');
        const outputFilename = `${baseName}-audio.${format}`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        const mimeTypes = {
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            aac: 'audio/aac',
            ogg: 'audio/ogg',
            flac: 'audio/flac',
            opus: 'audio/ogg',
        };

        // Map format to ffmpeg codec
        const codecMap = {
            mp3: 'libmp3lame',
            wav: 'pcm_s16le',
            aac: 'aac',
            ogg: 'libvorbis',
            flac: 'flac',
            opus: 'libopus',
        };

        let command = ffmpeg(inputPath)
            .noVideo()
            .audioCodec(codecMap[format] || format);

        // Bitrate doesn't apply to lossless formats
        if (!['wav', 'flac'].includes(format)) {
            command = command.audioBitrate(bitrate + 'k');
        }

        command
            .output(outputPath)
            .on('error', (err) => {
                console.error('Video→Audio error:', err.message);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Conversion failed: ' + err.message });
                }
            })
            .on('end', () => {
                const outputSize = fs.statSync(outputPath).size;
                fs.unlinkSync(inputPath);

                res.setHeader('Content-Type', mimeTypes[format] || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
                res.setHeader('X-Original-Size', originalSize);
                res.setHeader('X-Output-Size', outputSize);
                res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Output-Size');

                const stream = fs.createReadStream(outputPath);
                stream.pipe(res);
                stream.on('end', () => {
                    setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
                });
            })
            .run();

    } catch (err) {
        console.error('Video→Audio error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Conversion failed: ' + err.message });
    }
};

// ──────────────────────────────────────
//  Audio Format Conversion
// ──────────────────────────────────────
exports.convertAudio = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const inputPath = req.file.path;
        const originalSize = fs.statSync(inputPath).size;
        const format = (req.body.format || 'mp3').toLowerCase();
        const bitrate = req.body.bitrate || '192';
        const sampleRate = parseInt(req.body.sampleRate) || null;

        const supportedFormats = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'opus', 'm4a'];
        if (!supportedFormats.includes(format)) {
            fs.unlinkSync(inputPath);
            return res.status(400).json({
                error: `Unsupported format: ${format}. Supported: ${supportedFormats.join(', ')}`,
            });
        }

        const baseName = path.basename(req.file.originalname).replace(/\.\w+$/, '');
        const ext = format === 'm4a' ? 'm4a' : format;
        const outputFilename = `${baseName}-converted.${ext}`;
        const outputPath = path.join(__dirname, '..', 'output', outputFilename);

        const mimeTypes = {
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            aac: 'audio/aac',
            ogg: 'audio/ogg',
            flac: 'audio/flac',
            opus: 'audio/ogg',
            m4a: 'audio/mp4',
        };

        const codecMap = {
            mp3: 'libmp3lame',
            wav: 'pcm_s16le',
            aac: 'aac',
            ogg: 'libvorbis',
            flac: 'flac',
            opus: 'libopus',
            m4a: 'aac',
        };

        let command = ffmpeg(inputPath)
            .audioCodec(codecMap[format] || format);

        if (!['wav', 'flac'].includes(format)) {
            command = command.audioBitrate(bitrate + 'k');
        }

        if (sampleRate) {
            command = command.audioFrequency(sampleRate);
        }

        // m4a needs mp4 container
        if (format === 'm4a') {
            command = command.format('mp4');
        }

        command
            .output(outputPath)
            .on('error', (err) => {
                console.error('Audio convert error:', err.message);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Conversion failed: ' + err.message });
                }
            })
            .on('end', () => {
                const outputSize = fs.statSync(outputPath).size;
                fs.unlinkSync(inputPath);

                res.setHeader('Content-Type', mimeTypes[format] || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
                res.setHeader('X-Original-Size', originalSize);
                res.setHeader('X-Output-Size', outputSize);
                res.setHeader('Access-Control-Expose-Headers', 'X-Original-Size, X-Output-Size');

                const stream = fs.createReadStream(outputPath);
                stream.pipe(res);
                stream.on('end', () => {
                    setTimeout(() => fs.unlink(outputPath, () => { }), 5000);
                });
            })
            .run();

    } catch (err) {
        console.error('Audio convert error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Conversion failed: ' + err.message });
    }
};
