// backend/Routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/reset-password-challenge', userController.resetPasswordChallenge);
router.post('/reset-password', userController.resetPassword); // <-- **DOUBLE-CHECK THIS LINE**

module.exports = router;