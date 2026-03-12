const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    togglePinProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, admin, upload.array('images'), createProject);

router.route('/reorder')
    .put(protect, admin, reorderProjects);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, upload.array('images'), updateProject)
    .delete(protect, admin, deleteProject);

router.route('/:id/pin')
    .patch(protect, admin, togglePinProject);

module.exports = router;
