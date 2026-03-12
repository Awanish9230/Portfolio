const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

// @desc    Increment site views
// @route   POST /api/stats/increment
router.post('/increment', async (req, res) => {
    try {
        let stats = await Stats.findOne();
        if (!stats) {
            stats = new Stats({ totalViews: 1 });
        } else {
            stats.totalViews += 1;
            stats.lastUpdated = Date.now();
        }
        await stats.save();
        res.status(200).json({ success: true, totalViews: stats.totalViews });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get site stats
// @route   GET /api/stats
router.get('/', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        res.status(200).json(stats || { totalViews: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
