const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration (Only allowed by admin)
exports.register = async (req, res) => {
    // Only allow registration by users with 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized. Only admins can register new users.' });
    }

    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ name, email, password, role });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token with user ID and role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token as a response
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
