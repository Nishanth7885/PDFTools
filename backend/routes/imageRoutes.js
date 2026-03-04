const express = require('express');
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    const allowed = [
        'image/jpeg', 'image/png', 'image/webp',
        'image/gif', 'image/tiff', 'image/bmp', 'image/avif',
        'image/heic', 'image/heif'
    ];
    // Also check for extension or allow all images because some browsers send application/octet-stream for heic
    if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().match(/\.(heic|heif)$/)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported image format'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: imageFilter
});

router.post('/compress', upload.single('file'), imageController.compressImage);
router.post('/resize', upload.single('file'), imageController.resizeImage);
router.post('/convert', upload.single('file'), imageController.convertImage);
router.post('/strip-metadata', upload.single('file'), imageController.stripMetadata);
router.post('/convert-heic', upload.single('file'), imageController.convertHeic);

module.exports = router;
