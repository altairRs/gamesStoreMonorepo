// backend/Controllers/userController.js
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

exports.resetPasswordChallenge = async (req, res) => {
    try {
        const { usernameOrEmail, wallahiChallenge } = req.body;

        // Find user by username or email
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found
        }

        // Verify "wallahi" challenge (case-insensitive comparison)
        if (wallahiChallenge.toLowerCase() !== 'wallahi') {
            return res.status(400).json({ message: 'Incorrect verification word' }); // Incorrect wallahi
        }

        // If user found and wallahi is correct, you could generate a temporary token here
        // For this simplified example, we'll just send a success message indicating challenge passed

        res.status(200).json({ message: 'Verification successful. Proceed to reset password.' }); // Challenge passed
    } catch (error) {
        console.error('Error in reset password challenge:', error);
        res.status(500).json({ message: 'Failed to process password reset challenge', error: error.message }); // Server error
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { usernameOrEmail, newPassword } = req.body;
        console.log('Reset Password Request for usernameOrEmail:', usernameOrEmail);
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        if (!user) {
            console.log('User not found for reset:', usernameOrEmail);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found for reset:', user.username || user.email, user._id);

        // Removed because causing double hashing (middleware already hashes password)
        // const salt = await bcrypt.genSalt(10); // REMOVE THIS LINE
        // const hashedPassword = await bcrypt.hash(newPassword, salt); // REMOVE THIS LINE
        // console.log('Hashed Password (in controller) BEFORE save:', hashedPassword); // REMOVE OR COMMENT OUT
        // const passwordToSave = hashedPassword; // REMOVE THIS LINE

        // **Just assign the *plain text* newPassword to user.password**
        user.password = newPassword; // Assign the *plain text* new password

        console.log('Password to be assigned to user.password (plain text in controller):', newPassword.substring(0, 10) + '...'); // Log first part of plain text password
        await user.save(); // Now, middleware will hash it

        console.log('User saved successfully AFTER password reset. User _id:', user._id);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
};