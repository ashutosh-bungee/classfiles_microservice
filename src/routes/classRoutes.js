const express = require('express');
const { createClassroom, updateClassroom, deleteClassroom, addStudent, getClassesFeed } = require('../controllers/classController');
const authenticateToken = require('../middlewares/authenticateToken');
const { isTutor } = require('../middlewares/roleCheck');

const router = express.Router();

router.post('/', authenticateToken, isTutor, createClassroom);
router.put('/:classId', authenticateToken, isTutor, updateClassroom);
router.delete('/:classId', authenticateToken, isTutor, deleteClassroom);
router.post('/addStudent', authenticateToken, isTutor, addStudent);
router.get('/feed', authenticateToken, getClassesFeed);


module.exports = router;
