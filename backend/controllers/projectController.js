const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const {
        title,
        shortDescription,
        fullDescription,
        technologies, // Expecting valid JSON string or array
        video,
        githubLink,
        liveLink,
    } = req.body;

    let imagesPaths = [];
    imagesPaths = req.files.map((file) => file.path);

    try {
        const project = new Project({
            title,
            shortDescription,
            fullDescription,
            technologies: typeof technologies === 'string' ? JSON.parse(technologies) : technologies,
            images: imagesPaths,
            video,
            githubLink,
            liveLink,
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = req.body.title || project.title;
            project.shortDescription = req.body.shortDescription || project.shortDescription;
            project.fullDescription = req.body.fullDescription || project.fullDescription;
            project.technologies = req.body.technologies ? (typeof req.body.technologies === 'string' ? JSON.parse(req.body.technologies) : req.body.technologies) : project.technologies;
            project.video = req.body.video || project.video;
            project.githubLink = req.body.githubLink || project.githubLink;
            project.liveLink = req.body.liveLink || project.liveLink;

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.path);
                project.images = [...project.images, ...newImages];
            }

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
