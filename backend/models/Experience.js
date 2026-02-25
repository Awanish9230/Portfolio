const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Internship', 'Training', 'Project', 'Job', 'Certification'],
        required: true,
    },
}, {
    timestamps: true,
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
