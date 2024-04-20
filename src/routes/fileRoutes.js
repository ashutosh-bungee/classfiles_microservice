const express = require('express');
const {
    uploadFile,
    renameFile,
    deleteFile,
    getFilesByClass,
    filterFiles,
    getFilesFeed
} = require('../controllers/fileController');
const authenticateToken = require('../middlewares/authenticateToken');
const { isTutor } = require('../middlewares/roleCheck');

const router = express.Router();

router.post('/',authenticateToken, isTutor, uploadFile);
router.put('/:fileId',authenticateToken, renameFile);
router.delete('/:fileId',authenticateToken, deleteFile);
router.get('/class/:classId',authenticateToken ,getFilesByClass);
router.get('/search',authenticateToken ,filterFiles);
router.get('/feed', authenticateToken, getFilesFeed);

module.exports = router;
