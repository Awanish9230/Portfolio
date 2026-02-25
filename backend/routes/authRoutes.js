const express = require('express');
const router = express.Router();
const { authUser, updateUserProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.route('/profile').put(protect, admin, updateUserProfile);

module.exports = router;
