// backend/Controllers/orderController.js
const Order = require('../Models/order');
const Product = require('../Models/product');
const UserLog = require('../Models/userLog'); // Import UserLog model

// Function to place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { products: orderedProducts } = req.body;
        const userId = req.user._id;   // Get user ID from authenticated user (authMiddleware)

        if (!orderedProducts || !Array.isArray(orderedProducts) || orderedProducts.length === 0) {
            return res.status(400).json({ message: 'No products in order' });
        }

        let orderItems = [];
        let totalAmount = 0;
        let productDetailsForLog = []; // Array to collect product details for logging

        for (const orderedProduct of orderedProducts) {
            const { productId, quantity } = orderedProduct;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid product data in order' });
            }

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            if (product.stockQuantity < quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            const itemPrice = product.price;
            const itemName = product.name;

            orderItems.push({
                productId: product._id,
                quantity: quantity,
                price: itemPrice,
                name: itemName,
            });
            totalAmount += itemPrice * quantity;

            productDetailsForLog.push({ // Add product details for logging
                productId: product._id,
                productName: itemName,
                quantity: quantity,
                itemPrice: itemPrice
            });
        }

        const order = new Order({
            userId: userId,
            products: orderItems,
            totalAmount: totalAmount,
            // You can add shipping address and other order details here from req.body if needed
        });

        const savedOrder = await order.save();

        // --- Logging Order Placement (after successful order save) ---
        const activityDetails = {
            orderId: savedOrder._id, // Log the newly created order ID
            totalAmount: totalAmount,
            productCount: orderItems.length,
            products: productDetailsForLog // Log array of product details in the order
            // You can add more order details to log if needed (e.g., shipping address, payment method, etc.)
        };

        await UserLog.create({
            userId: userId, // User ID is always available as placeOrder is a protected route
            activityType: 'purchase', // Use 'purchase' or 'orderPlaced' as activity type
            activityDetails: activityDetails
        });
        console.log('Order placed and logged:', activityDetails, 'User ID:', userId); // Optional console log

        res.status(201).json(savedOrder);

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

// Function to get order details by ID (for admin or order owner - authorization needed in real app)
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('userId', 'username email'); // Populate user details

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order by ID:', error);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        res.status(500).json({ message: 'Failed to fetch order details', error: error.message });
    }
};

// Function to get order history for a user (for user profile page)
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from request parameters

        // Basic validation to check if the requested userId matches the logged-in user's ID
        // In a real app, you'd have more robust authorization logic
        if (req.user.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to view orders for this user' }); // 403 Forbidden if trying to access another user's orders
        }


        const orders = await Order.find({ userId: userId }).populate('userId', 'username email').sort({ orderDate: -1 }); // Find orders by userId, populate user, sort by orderDate desc

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting user order history:', error);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Failed to fetch order history', error: error.message });
    }
};