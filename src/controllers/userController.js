const bcrypt = require('bcrypt');
const pool = require('../config/db'); 

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, role]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Failed to create user');
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params; 

    let intUserid = parseInt(userId);

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *', 
            [intUserid]
        );
        if (result.rows.length > 0) {
            res.json({ message: "User deleted successfully", user: result.rows[0] });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Failed to delete user');
    }
};