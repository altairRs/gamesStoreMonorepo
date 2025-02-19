const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this username or email' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id, username: newUser.username, email: newUser.email });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token: token, userId: user._id, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
};