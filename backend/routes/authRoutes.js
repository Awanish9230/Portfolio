const express = require('express');
const router = express.Router();
const { authUser, logoutUser, getMe, updateUserProfile, getPublicProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/public-profile', getPublicProfile);
router.get('/verify', protect, getMe);
router.route('/profile').put(
    protect,
    admin,
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
    updateUserProfile
);

module.exports = router;
