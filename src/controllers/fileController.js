const pool = require('../config/db'); 

exports.uploadFile = async (req, res) => {
    const { classId, fileName, fileDescription, fileType } = req.body;

    const uploadedBy = req.user.userId;

    try {
        const newFile = await pool.query(
            'INSERT INTO files (class_id, file_name, file_description, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [classId, fileName, fileDescription, fileType, uploadedBy]
        );
        res.status(201).json(newFile.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while uploading file');
    }
};

exports.renameFile = async (req, res) => {
    const { fileId } = req.params;
    const { newFileName } = req.body;

    try {
        const result = await pool.query(
            'UPDATE files SET file_name = $1 WHERE id = $2 AND deleted = FALSE RETURNING *',
            [newFileName, fileId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('File not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while renaming file');
    }
};

exports.deleteFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        await pool.query(
            'UPDATE files SET deleted = TRUE WHERE id = $1',
            [fileId]
        );
        res.send({ message: 'File deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while deleting file');
    }
};

exports.getFilesByClass = async (req, res) => {
    const { classId } = req.params;

    try {
        const classFiles = await pool.query(
            'SELECT * FROM files WHERE class_id = $1 AND deleted = FALSE',
            [classId]
        );
        res.json(classFiles.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while retrieving files');
    }
};


exports.getFilesFeed = async (req, res) => {
    const { classId, fileType, search } = req.query;

    let queryParams = [];
    let queryText = 'SELECT * FROM files WHERE class_id = $1 AND deleted = FALSE';
    queryParams.push(classId);

    if (fileType) {
        queryParams.push(fileType.toUpperCase());
        queryText += ` AND file_type = $${queryParams.length}`;
    }

    if (search) {
        queryParams.push(`%${search}%`);
        queryText += ` AND file_name ILIKE $${queryParams.length}`;
    }

    try {
        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while retrieving files');
    }
};
