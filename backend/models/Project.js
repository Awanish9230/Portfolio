const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
        required: true,
    },
    technologies: [{
        type: String,
        required: true,
    }],
    images: [{
        type: String, // URLs to uploaded images
        required: true,
    }],
    video: {
        type: String, // URL to uploaded video or embedded link
    },
    githubLink: {
        type: String,
    },
    liveLink: {
        type: String,
    },
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
