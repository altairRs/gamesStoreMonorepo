// backend/Controllers/orderController.js
const Order = require('../Models/order'); // Import Order model
const Product = require('../Models/product'); // Import Product model (to verify product existence and price)
const UserLog = require('../Models/userLog'); // Import UserLog model (to log order activity)

// Function to place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { products: orderedProducts } = req.body; // Get products array from request body
        const userId = req.user._id;   // Get user ID from authenticated user (authMiddleware)

        console.log('userId variable value (before Order creation):', userId);

        console.log('req.user in placeOrder controller:', req.user);

        if (!orderedProducts || !Array.isArray(orderedProducts) || orderedProducts.length === 0) {
            return res.status(400).json({ message: 'No products in order' }); // Validate product list
        }

        let orderItems = [];
        let totalAmount = 0;

        for (const orderedProduct of orderedProducts) {
            const { productId, quantity } = orderedProduct;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid product data in order' }); // Validate individual product data
            }

            const product = await Product.findById(productId); // Fetch product details from database

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` }); // Check if product exists
            }

            if (product.stockQuantity < quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` }); // Check stock quantity
            }


            const itemPrice = product.price; // Use current product price from database
            const itemName = product.name;

            orderItems.push({
                productId: product._id,
                quantity: quantity,
                price: itemPrice,
                name: itemName,
            });
            totalAmount += itemPrice * quantity;

             // Optionally decrease stock quantity after successful order (for digital games, you might skip this or handle differently)
             // product.stockQuantity -= quantity;
             // await product.save(); // Save updated stock quantity
        }


        const order = new Order({
            userId: userId,
            products: orderItems,
            totalAmount: totalAmount,
            // You can add shipping address and other order details here from req.body if needed
        });

        const savedOrder = await order.save(); // Save the order to the database

        res.status(201).json(savedOrder); // Respond with the saved order
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

