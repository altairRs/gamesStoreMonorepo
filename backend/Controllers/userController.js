const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


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

        console.log("Login attempt for user:", user.username || user.email); // Log user being attempted to log in
        console.log("Plaintext password received:", password); // Log plaintext password from request
        console.log("Stored hashed password from DB:", user.password); // Log hashed password from database

        const isPasswordMatch = await user.comparePassword(password);
        console.log("Password comparison result:", isPasswordMatch); // Log comparison result

        if (!isPasswordMatch) {
            console.log("Password comparison failed!"); // Log if comparison fails
            return res.status(401).json({ message: 'Invalid credentials' }); // Password incorrect <--- **Likely hitting this part**
        } else {
            console.log("Password comparison successful!"); // Log if comparison succeeds
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

exports.forgotPassword = async (req, res) => {
    try {
        const { usernameOrEmail, confirmationWord } = req.body; // Expecting 'confirmationWord' now

        // Check for "wallahi" confirmation
        if (confirmationWord !== 'wallahi') {
            return res.status(400).json({ message: 'Incorrect confirmation word.' }); // Reject if confirmation word is wrong
        }


        // Find user by username or email
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that username or email' });
        }

        // If user found and "wallahi" is correct, send success response to proceed to reset password page
        res.status(200).json({ message: 'Confirmation successful. Proceed to reset password.', userId: user._id }); // Send userId for next step
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ message: 'Failed to process forgot password request', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL path params
        const { password } = req.body; // Get new password from request body

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid user ID for password reset.' }); // User not found for given ID
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed New Password:", hashedPassword); 

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save({ validateBeforeSave: false }); // Save updated password, skip validation

        res.status(200).json({ message: 'Password reset successful.' }); // Success response

    } catch (error) {
        console.error('Error processing reset password request:', error);
        res.status(500).json({ message: 'Failed to reset password.', error: error.message });
    }
};