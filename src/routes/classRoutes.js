const express = require('express');
const { createClassroom, updateClassroom, deleteClassroom, addStudent, getClassesFeed } = require('../controllers/classController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createClassroom);
router.put('/:classId', authenticateToken, updateClassroom);
router.delete('/:classId', authenticateToken, deleteClassroom);
router.post('/addStudent', authenticateToken, addStudent);
router.get('/feed', authenticateToken, getClassesFeed);


module.exports = router;
