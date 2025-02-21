// backend/Middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Import User model

const authMiddleware = async (req, res, next) => {
    let token = req.header('Authorization'); // Get the full Authorization header value



    if (!token) {
        console.log('No token provided in Authorization header.');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // --- NEW CODE: Remove "Bearer " prefix if present ---
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Extract token string after "Bearer "
    }
    console.log('Extracted Token (after removing Bearer prefix):', token); // Log the extracted token

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');



        req.user = await User.findById(decoded.userId).select('-password');
        console.log('Authenticated User object fetched from DB:', req.user); // <-- Add this line

        if (!req.user) {
            console.log('User not found in database for userId:', decoded.userId);
            return res.status(401).json({ message: 'Token is not valid for any user' });
        }

        console.log('Authenticated User found:', req.user);

        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
};

module.exports = authMiddleware;