const express = require('express');
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname),
});

const pdfUpload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: (req, file, cb) => file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF files allowed'), false) });
const imgUpload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed'), false) });

// PDF tools
router.post('/compress', pdfUpload.single('file'), pdfController.compressPDF);
router.post('/merge', pdfUpload.array('files', 20), pdfController.mergePDFs);
router.post('/protect', pdfUpload.single('file'), pdfController.protectPDF);
router.post('/split', pdfUpload.single('file'), pdfController.splitPDF);
router.post('/rotate', pdfUpload.single('file'), pdfController.rotatePDF);
router.post('/watermark', pdfUpload.single('file'), pdfController.watermarkPDF);
router.post('/jpg-to-pdf', imgUpload.array('files', 30), pdfController.jpgToPDF);
router.post('/unlock', pdfUpload.single('file'), pdfController.unlockPDF);
router.post('/page-numbers', pdfUpload.single('file'), pdfController.addPageNumbers);
router.post('/organize', pdfUpload.single('file'), pdfController.organizePDF);
router.post('/html-to-pdf', express.json({ limit: '5mb' }), pdfController.htmlToPDF);
router.post('/print-ready', pdfUpload.single('file'), pdfController.printReadyPDF);

module.exports = router;
