const path   = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fs     = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads/');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const hash = crypto.randomBytes(6).toString('hex');
        const ext  = path.extname(file.originalname).toLowerCase();
        cb(null, `${hash}${ext}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

module.exports = upload;