const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
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

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const filetypes = /jpg|jpeg|png|mp4|mkv/;
        const extname = path.extname(file.originalname).toLowerCase();
        
        let folder = 'portfolio/images';
        let resource_type = 'image';

        if (extname === '.mp4' || extname === '.mkv') {
            folder = 'portfolio/videos';
            resource_type = 'video';
        }

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and Videos only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
