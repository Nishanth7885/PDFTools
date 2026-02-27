const express = require('express');
const multer = require('multer');
const path = require('path');
const mediaController = require('../controllers/mediaController');

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

// Video upload — generous size limit for videos
const videoUpload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'video/mp4', 'video/x-matroska', 'video/webm', 'video/avi',
            'video/x-msvideo', 'video/quicktime', 'video/x-flv',
            'video/x-ms-wmv', 'video/3gpp', 'video/ogg',
        ];
        if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp4|mkv|webm|avi|mov|flv|wmv|3gp|ogv)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported video format'), false);
        }
    }
});

// Audio upload
const audioUpload = multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg',
            'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a',
            'audio/webm', 'audio/x-ms-wma', 'audio/amr',
        ];
        if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg|flac|aac|m4a|wma|webm|amr|opus)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported audio format'), false);
        }
    }
});

router.post('/video-to-audio', videoUpload.single('file'), mediaController.videoToAudio);
router.post('/audio-convert', audioUpload.single('file'), mediaController.convertAudio);

module.exports = router;
