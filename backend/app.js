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

// Connect to MongoDB
connectDB();

// Mount User Routes
app.use('/api/users', userRoutes);
// Mount Product Routes
app.use('/api/products', productRoutes);

// Sample Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running on port " + PORT);
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});