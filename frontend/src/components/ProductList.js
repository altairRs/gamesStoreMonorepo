// frontend/src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Get current location object
    const searchParams = new URLSearchParams(location.search); // Create URLSearchParams object from query string
    const searchTerm = searchParams.get('search') || ''; // Get 'search' query parameter, default to empty string

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:4000/api/products?search=${encodeURIComponent(searchTerm)}`); // Include search query in API request
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm]); // Re-fetch products when searchTerm changes

    if (loading) {
        return <p style={{ color: '#eee' }}>Loading products...</p>; // Light text for loading message
    }

    if (error) {
        return <p style={{ color: '#f44336' }}>Error loading products: {error.message}</p>; // Error text in red
    }

    return (
        <div style={productListContainerStyle}>
            <h2 style={productListHeadingStyle}>Product Catalog</h2>
            <ul style={productListUlStyle}>
                {products.map(product => (
                    <li key={product._id} style={productListItemStyle}>
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Wrap with Link */}
                            <h3 style={productNameStyle}>{product.name}</h3>
                            <p style={productCategoryStyle}>Category: {product.category}</p>
                            <p style={productDescriptionStyle}>{product.description}</p>
                            <p style={productPriceStyle}>Price: ${product.price.toFixed(2)}</p>
                            <p style={productAvailabilityStyle}>
                                Availability: {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                            {product.images && product.images.length > 0 && (
                                <div style={productImagesContainerStyle}>
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} - Image ${index + 1}`}
                                            style={productImageStyle}
                                        />
                                    ))}
                                </div>
                            )}
                        </Link> {/* End Link */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// --- Inline Styles - Black Theme (Vercel-inspired) ---
const productListContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '960px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#111',       // Dark background - almost black
    color: '#eee',                 // Default text color - light gray
    borderRadius: '8px',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Removed or softened shadow for dark theme
};

const productListHeadingStyle = {
    color: '#fff',             // White heading text
    fontSize: '2.2rem',         // Slightly larger heading
    marginBottom: '25px',       // More margin below heading
    textAlign: 'center',
    fontWeight: 'bold',       // Bold heading
};

const productListUlStyle = {
    listStyle: 'none',
    padding: 0,
};

const productListItemStyle = {
    marginBottom: '30px',
    padding: '25px',           // Slightly more padding inside list items
    backgroundColor: '#222',     // Slightly lighter dark background for list items
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(255,255,255,0.05)', // Very subtle white shadow for depth
    border: '1px solid #333',  // Add a subtle border for definition
};

const productNameStyle = {
    fontSize: '1.7rem',         // Slightly larger product name
    color: '#fff',             // White product name
    marginBottom: '12px',
    fontWeight: 'bold',
};

const productCategoryStyle = {
    color: '#aaa',             // Light gray category text
    marginBottom: '8px',
    fontStyle: 'italic',
};

const productDescriptionStyle = {
    color: '#ddd',             // Light gray description text
    lineHeight: '1.7',
    marginBottom: '20px',
};

const productPriceStyle = {
    color: '#00bcd4',         // Cyan/Teal for price (Vercel accent color in dark theme feel)
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginBottom: '12px',
};

const productAvailabilityStyle = {
    color: '#8bc34a',         // Light green for "In Stock" in dark theme
    fontWeight: 'bold',
    marginBottom: '12px',
};

const productImagesContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    marginTop: '15px',
    borderTop: '1px solid #333', // Separator line above images
    paddingTop: '15px',
};

const productImageStyle = {
    maxWidth: '180px',         // Slightly wider images in dark theme
    marginRight: '15px',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)', // Add a bit more shadow to images for depth
};


export default ProductList;