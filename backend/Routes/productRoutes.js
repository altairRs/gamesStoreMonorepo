// backend/Routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const authMiddleware = require('../Middleware/authMiddleware'); // Import authMiddleware

// Define product routes

// POST /api/products - Create a new product (Admin only - Authentication required)
router.post('/', authMiddleware, productController.createProduct); // Apply authMiddleware here

// GET /api/products - Get all products (Public - No authentication needed)
router.get('/', productController.getProducts);

// GET /api/products/:id - Get a product by ID (Now with Authentication - for logging User ID)
router.get('/:id', authMiddleware, productController.getProductById); // **Apply authMiddleware HERE!**

// PUT /api/products/:id - Update a product by ID (Admin only - Authentication required)
router.put('/:id', authMiddleware, productController.updateProduct); // Apply authMiddleware here

// DELETE /api/products/:id - Delete a product by ID (Admin only - Authentication required)
router.delete('/:id', authMiddleware, productController.deleteProduct); // Apply authMiddleware here

module.exports = router;