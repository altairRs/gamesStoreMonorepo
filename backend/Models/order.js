// backend/Models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true,
    },
    products: [{ // Array of products in the order
        productId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Product model
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: { // Store current price at time of order (in case product price changes later)
            type: Number,
            required: true,
        },
        name: { // Store product name at time of order
            type: String,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], // Order status options
        default: 'pending', // Default order status is 'pending'
    },
    shippingAddress: { // You can add shipping address fields if needed for physical products later
        // For digital products, you might keep this optional or remove it
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    // You can add more fields as needed (e.g., payment information, etc.)
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;