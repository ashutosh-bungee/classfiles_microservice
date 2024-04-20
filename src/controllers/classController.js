const pool = require('../config/db'); 

exports.createClassroom = async (req, res) => {
    const { name, tutorId } = req.body;
    try {
        const newClass = await pool.query(
            'INSERT INTO classrooms (name, tutor_id) VALUES ($1, $2) RETURNING *',
            [name, tutorId]
        );
        res.status(201).json(newClass.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while creating classroom');
    }
};

exports.updateClassroom = async (req, res) => {
    const { classId } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE classrooms SET name = $1 WHERE id = $2 RETURNING *',
            [name, classId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Classroom not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while updating classroom');
    }
};

exports.deleteClassroom = async (req, res) => {
    const { classId } = req.params;
    try {
        await pool.query('DELETE FROM classrooms WHERE id = $1', [classId]);
        res.send({ message: 'Classroom deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while deleting classroom');
    }
};

exports.addStudent = async (req, res) => {
    const { classId, studentId } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO enrollments (class_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [classId, studentId]
        );
        if (result.rows.length === 0) {
            return res.status(409).send('Student already enrolled or classroom not found');
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while adding student to classroom');
    }
};

exports.getClassesFeed = async (req, res) => {
    const userId = req.user.userId; 
    try {
        let relevantClasses;
        if (req.user.role === "tutor") {
            relevantClasses = await pool.query(
                'SELECT * FROM classrooms WHERE tutor_id = $1',
                [userId]
            );
        } else {
            relevantClasses = await pool.query(
                'SELECT c.* FROM enrollments e JOIN classrooms c ON e.class_id = c.id WHERE e.student_id = $1',
                [userId]
            );
        }
        res.json(relevantClasses.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while retrieving classes');
    }
};
