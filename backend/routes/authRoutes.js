const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Include the middleware for authentication
const router = express.Router();

// Register route - only accessible by admin (check in controller)
router.post('/register', authMiddleware, register); // The controller already checks if the user is admin

// Login route
router.post('/login', login);

module.exports = router;
