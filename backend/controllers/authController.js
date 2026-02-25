const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/admin/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Update user profile (admin)
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.files) {
            if (req.files.profileImage && req.files.profileImage[0]) {
                user.profileImage = req.files.profileImage[0].path;
            }
            if (req.files.resume && req.files.resume[0]) {
                user.resume = req.files.resume[0].path;
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profileImage: updatedUser.profileImage,
            resume: updatedUser.resume,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get public profile data (image & resume)
// @route   GET /api/admin/public-profile
// @access  Public
const getPublicProfile = async (req, res) => {
    // Assuming there is a primary admin for the portfolio
    const admin = await User.findOne({ isAdmin: true });

    if (admin) {
        res.json({
            profileImage: admin.profileImage || '/profile.png',
            resume: admin.resume || ''
        });
    } else {
        res.status(404).json({ message: 'Admin profile not found' });
    }
};

module.exports = { authUser, updateUserProfile, getPublicProfile };

