const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ isPinned: -1, order: 1, createdAt: -1 });
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
// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private/Admin
const reorderProjects = async (req, res) => {
    const { projectOrder } = req.body; // Array of { id, order }

    try {
        const updatePromises = projectOrder.map(({ id, order }) =>
            Project.findByIdAndUpdate(id, { order }, { new: true })
        );
        await Promise.all(updatePromises);
        res.json({ message: 'Projects reordered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Toggle pin project
// @route   PATCH /api/projects/:id/pin
// @access  Private/Admin
const togglePinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.isPinned = !project.isPinned;
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    togglePinProject,
};
