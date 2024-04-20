const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Username or password is incorrect' });
        }

        const user = userQuery.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (isMatch) {
            const accessToken = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ accessToken });
        } else {
            res.status(401).json({ error: 'Username or password is incorrect' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
