// backend/app.js
const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Import User Routes
const userRoutes = require('./Routes/userRoutes');
// Import Product Routes
const productRoutes = require('./Routes/productRoutes');
// Import Order Routes
const orderRoutes = require('./Routes/orderRoutes');

// Connect to MongoDB
connectDB();

// Mount User Routes
app.use('/api/users', userRoutes);
// Mount Product Routes
app.use('/api/products', productRoutes);
// Mount Order Routes
app.use('/api/orders', orderRoutes);

// Sample Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running on port " + PORT);
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});