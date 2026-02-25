const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, admin, upload.array('images'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, upload.array('images'), updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;
