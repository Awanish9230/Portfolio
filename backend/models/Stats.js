const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalViews: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
