const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the token from the 'Authorization' header
    const token = req.header('Authorization')?.split(' ')[1]; // Extracts token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = decoded;
        next(); // Pass control to the next middleware or route handler
    } catch (err) {
        console.error(err); // Optional: for debugging
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
