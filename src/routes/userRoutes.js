const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const { isTutor } = require('../middlewares/roleCheck');

router.post('/create', authenticateToken, userController.createUser);
router.delete('/:userId', authenticateToken, isTutor, userController.deleteUser);


module.exports = router;
