// backend/Routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../Controllers/logController');
const authMiddleware = require('../Middleware/authMiddleware'); // Import authMiddleware

// Define log routes

// POST /api/logs/cart-action - Log a cart action (Authentication is optional - to capture userId if logged in)
router.post('/cart-action', authMiddleware, logController.cartActionLog); // Apply authMiddleware (optional)

module.exports = router;