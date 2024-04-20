const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());  // Parse JSON bodies

// Route handlers
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const userRoutes = require('./src/routes/userRoutes'); // Ensure this is the correct path

// Use routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/classes', classRoutes);  // Class management routes
app.use('/api/files', fileRoutes);  // File management routes
app.use('/api/users', userRoutes);


// Basic route for health check
app.get('/', (req, res) => {
    res.send('Welcome to the Class Files Microservice');
});

// Handling undefined routes
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
