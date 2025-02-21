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
        const { search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query; // Extract sorting parameters

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