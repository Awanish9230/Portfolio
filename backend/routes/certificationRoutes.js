const express = require('express');
const router = express.Router();
const {
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    reorderCertifications,
} = require('../controllers/certificationController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getCertifications)
    .post(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createCertification);

router.route('/reorder')
    .put(protect, admin, reorderCertifications);

router.route('/:id')
    .put(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), updateCertification)
    .delete(protect, admin, deleteCertification);

module.exports = router;
