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

exports.getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        res.json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        console.log("🔄 Password update request received for:", req.user.id);

        // ✅ Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: '⚠️ Both current and new passwords are required' });
        }

        // ✅ Fetch user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: '❌ User not found' });
        }

        // ✅ Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '⛔ Incorrect current password' });
        }

        // ✅ Prevent using the same password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: '⚠️ New password must be different from the current password' });
        }

        // ✅ Hash new password securely
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        console.log("✅ Password updated successfully for user:", user.username);
        res.json({ message: '✅ Password updated successfully' });

    } catch (error) {
        console.error("❌ Error changing password:", error);
        res.status(500).json({ message: '⚠️ Server error', error: error.message });
    }
};*/

