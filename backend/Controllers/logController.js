// backend/Controllers/logController.js
const UserLog = require('../Models/userLog'); // Import UserLog model
const authMiddleware = require('../Middleware/authMiddleware'); // Import authMiddleware

exports.cartActionLog = async (req, res) => {
    try {
        const { activityType, activityDetails } = req.body;
        const userId = req.user?._id; // Get userId from authenticated user (authMiddleware)

        if (!activityType) {
            return res.status(400).json({ message: 'activityType is required' });
        }

        await UserLog.create({
            userId: userId || null, // Use userId if available, otherwise null
            activityType: activityType,
            activityDetails: activityDetails || {} // Default to empty object if no details provided
        });

        console.log('Cart action logged:', activityType, activityDetails, 'User ID:', userId || 'Anonymous'); // Optional console log

        res.status(200).json({ message: 'Cart action logged successfully' }); // Respond with success
    } catch (error) {
        console.error('Error logging cart action:', error);
        res.status(500).json({ message: 'Failed to log cart action', error: error.message });
    }
};