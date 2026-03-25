const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = CloudinaryStorage({
    cloudinary: { v2: cloudinary }, // v2.2.1 expects an object with a .v2 property
    folder: 'portfolio/certifications',
    resource_type: 'image', // Use 'image' for PDFs too - this allows Cloudinary to generate thumbnails!
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mkv|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        cb('Images, Videos, and Documents only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
