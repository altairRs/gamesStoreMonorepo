const Product = require('../Models/product');

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
        const { search, category, minPrice, maxPrice } = req.query;

        let filter = {};

        if (search) {
            filter.$text = { $search: search };
        }

        if (category) {
            filter.category = category;
        }

        let priceFilter = {}; // Initialize priceFilter separately

        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);

        const isValidMinPrice = !isNaN(parsedMinPrice); // Check if parsedMinPrice is a valid number (not NaN)
        const isValidMaxPrice = !isNaN(parsedMaxPrice); // Check if parsedMaxPrice is a valid number (not NaN)


        if (isValidMinPrice && isValidMaxPrice) { // Both minPrice and maxPrice are valid numbers
            priceFilter = {
                $gte: parsedMinPrice,
                $lte: parsedMaxPrice
            };
        } else if (isValidMinPrice) { // Only minPrice is valid
            priceFilter = {
                $gte: parsedMinPrice
            };
        } else if (isValidMaxPrice) { // Only maxPrice is valid
            priceFilter = {
                $lte: parsedMaxPrice
            };
        }

        if (Object.keys(priceFilter).length > 0) { // Only apply price filter if it's not empty
            filter.price = priceFilter;
        }


        const products = await Product.find(filter);
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