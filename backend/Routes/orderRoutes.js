// backend/Routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const authMiddleware = require('../Middleware/authMiddleware'); // Import authMiddleware for protected routes

// Define order routes

// POST /api/orders - Place a new order (Authentication required)
router.post('/', authMiddleware, orderController.placeOrder); // Apply authMiddleware to protect route

// GET /api/orders/:orderId - Get order details by ID (Authentication required - for admin or order owner)
router.get('/:orderId', authMiddleware, orderController.getOrderById); // Protect this route as well

// GET /api/orders/user/:userId - Get order history for a user (Authentication required - for user to view own history)
router.get('/user/:userId', authMiddleware, orderController.getUserOrders); // Protect this route

module.exports = router;