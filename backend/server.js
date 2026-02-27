const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdfRoutes = require('./routes/pdfRoutes');
const imageRoutes = require('./routes/imageRoutes');
const docRoutes = require('./routes/docRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads and output directories
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://safefileconverter.online',
        'https://www.safefileconverter.online',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/doc', docRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PDFtools API is running' });
});

// Cleanup old files every 30 minutes
setInterval(() => {
    const dirs = [uploadsDir, outputDir];
    dirs.forEach(dir => {
        fs.readdir(dir, (err, files) => {
            if (err) return;
            files.forEach(file => {
                const filePath = path.join(dir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;
                    const now = Date.now();
                    const fileAge = now - stats.mtimeMs;
                    // Delete files older than 30 minutes
                    if (fileAge > 30 * 60 * 1000) {
                        fs.unlink(filePath, () => { });
                    }
                });
            });
        });
    });
}, 30 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`🚀 PDFtools API running on http://localhost:${PORT}`);
});
