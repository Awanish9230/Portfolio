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
        const token = generateToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/admin/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (current logged in user)
// @route   GET /api/admin/verify
// @access  Private
const getMe = async (req, res) => {
    const user = {
        _id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
    };
    res.status(200).json(user);
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

        const token = generateToken(updatedUser._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profileImage: updatedUser.profileImage,
            resume: updatedUser.resume,
            token: token,
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
            profileImage: admin.profileImage || '/profile_placeholder.png',
            resume: admin.resume || ''
        });
    } else {
        res.status(404).json({ message: 'Admin profile not found' });
    }
};

module.exports = { authUser, logoutUser, getMe, updateUserProfile, getPublicProfile };

