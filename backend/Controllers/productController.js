// backend/Controllers/productController.js
const Product = require('../Models/product');
const UserLog = require('../Models/userLog');
const jwt = require('jsonwebtoken');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

        // --- Manual JWT Verification for User ID (for public route logging) ---
        let userId = null; // Default to null (anonymous)
        const authHeader = req.headers.authorization; // Get Authorization header
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7); // Extract token (remove "Bearer ")
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key'); // Verify token
                userId = decoded.userId; // Extract userId if token is valid
            } catch (err) {
                console.error('JWT Verification Failed (in getProducts for logging):', err.message);
                // Token is invalid or expired, but we still proceed as it's a public route.
                // We just won't have a userId for logging.
            }
        }
        // --- End Manual JWT Verification ---


        // --- Logging Search Activity (rest remains the same, using the resolved userId) ---
        if (search) {
            const activityDetails = {
                searchTerm: search,
                categoryFilter: category || 'All Categories', // Log category filter if applied
                priceRange: (minPrice || maxPrice) ? { minPrice: minPrice || 'No Min', maxPrice: maxPrice || 'No Max' } : 'No Price Filter', // Log price range if applied
                sortBy: sortBy || 'No Sorting', // Log sorting if applied
                sortOrder: sortOrder || ''
                // You can add more search parameters to log if needed (e.g., pagination, etc.)
            };

            await UserLog.create({
                userId: userId || null, // Use resolved userId (could be from token or null)
                activityType: 'search',
                activityDetails: activityDetails
            });
            console.log('Search activity logged:', activityDetails, 'User ID:', userId || 'Anonymous'); // Optional console log
        }
        // --- End Logging Search Activity ---


        let filter = {};
        if (search) {
            filter.$text = { $search: search };
        }
        if (category) {
            filter.category = category;
        }

        let priceFilter = {};
        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);
        const isValidMinPrice = !isNaN(parsedMinPrice);
        const isValidMaxPrice = !isNaN(parsedMaxPrice);

        if (isValidMinPrice && isValidMaxPrice) {
            priceFilter = { $gte: parsedMinPrice, $lte: parsedMaxPrice };
        } else if (isValidMinPrice) {
            priceFilter = { $gte: parsedMinPrice };
        } else if (isValidMaxPrice) {
            priceFilter = { $lte: parsedMaxPrice };
        }
        if (Object.keys(priceFilter).length > 0) {
            filter.price = priceFilter;
        }

        let sort = {}; // Default sort is no sorting
        if (sortBy) {
            let order = sortOrder === 'desc' ? -1 : 1; // Determine sort order (-1 for desc, 1 for asc)
            if (sortBy === 'price') {
                sort.price = order; // Sort by price
            } else if (sortBy === 'name') {
                sort.name = order; // Sort by name
            }
        }


        const products = await Product.find(filter).sort(sort); // Apply sort to the query
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // --- Logging Product View ---
        const userId = req.user?._id; // Get userId from authenticated user (if logged in), otherwise undefined/null
        const activityDetails = {
            productId: product._id,
            productName: product.name,
            category: product.category // You can add more product details to log if needed
        };

        await UserLog.create({
            userId: userId || null, // Use userId if available, otherwise null for anonymous view
            activityType: 'productView',
            activityDetails: activityDetails
        });
        console.log('Product view logged:', activityDetails, 'User ID:', userId || 'Anonymous'); // Optional console log for debugging

        res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};