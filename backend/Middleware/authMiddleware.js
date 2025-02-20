// backend/Middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Import User model

const authMiddleware = async (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // 401 Unauthorized
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key'); // Verify token using secret key

        // Add user from payload to request object
        req.user = await User.findById(decoded.userId).select('-password'); // Fetch user by ID from token, exclude password
        if (!req.user) {
            return res.status(401).json({ message: 'Token is not valid for any user' }); // Token valid format, but user not found
        }
        next(); // Call next middleware in the chain (route handler)
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' }); // 401 Unauthorized - token invalid verification
    }
};

module.exports = authMiddleware;