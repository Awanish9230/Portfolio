const Experience = require('../models/Experience');

// @desc    Get all experience
// @route   GET /api/experience
// @access  Public
const getExperience = async (req, res) => {
    try {
        const experience = await Experience.find({}).sort({ createdAt: -1 }); // Newest first
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Private/Admin
const createExperience = async (req, res) => {
    const { title, organization, description, duration, type } = req.body;

    try {
        const experience = new Experience({
            title,
            organization,
            description,
            duration,
            type,
        });

        const createdExperience = await experience.save();
        res.status(201).json(createdExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
const updateExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (experience) {
            experience.title = req.body.title || experience.title;
            experience.organization = req.body.organization || experience.organization;
            experience.description = req.body.description || experience.description;
            experience.duration = req.body.duration || experience.duration;
            experience.type = req.body.type || experience.type;

            const updatedExperience = await experience.save();
            res.json(updatedExperience);
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private/Admin
const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (experience) {
            await experience.deleteOne();
            res.json({ message: 'Experience removed' });
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
};
