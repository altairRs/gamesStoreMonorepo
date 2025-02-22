// backend/Models/userLog.js
const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Optional: Reference to User model, can be null for unauthenticated activities
        default: null, // Allow null userId for anonymous activities
    },
    activityType: {
        type: String,
        required: true,
        enum: ['productView', 'purchase', 'search', 'login', 'register', 'logout', 'addToCart', 'removeFromCart', 'updateCartQuantity', 'clearCart'] // Add more activity types as needed
    },
    activityDetails: {
        type: mongoose.Schema.Types.Mixed, // Use Mixed type to allow flexible data for different activity types
        default: {} // Default to an empty object
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserLog = mongoose.model('UserLog', userLogSchema);

module.exports = UserLog;