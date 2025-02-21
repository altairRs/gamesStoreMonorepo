// frontend/src/components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import { useCart } from '../context/CartContext';


function ProductDetails() {
    const { productId } = useParams(); // Get the productId from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:4000/api/products/${productId}`); // Fetch product by ID
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Product not found'); // Specific error for 404
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]); // Re-fetch product if productId in URL changes

    if (loading) {
        return <p style={{ color: '#eee' }}>Loading product details...</p>;
    }

    if (error) {
        return <p style={{ color: '#f44336' }}>Error loading product details: {error.message}</p>;
    }

    if (!product) {
        return <p>Product not found.</p>; // Should not usually reach here if 404 is handled correctly, but as a fallback
    }

    const handleAddToCart = () => {
        const token = localStorage.getItem('authToken'); // Check if user is logged in
    
        if (!token) {
            alert('You must be logged in to add items to the cart!'); // Show alert if not logged in
            return; // Stop execution
        }
    
        addToCart(product); // Proceed with adding product to cart
        alert(`${product.name} added to cart!`); // Feedback message
    };

    return (
        <div style={productDetailsContainerStyle}> {/* Container style */}
            <h2 style={productDetailsNameStyle}>{product.name}</h2> {/* Product name */}
            <p style={productDetailsCategoryStyle}>Category: {product.category}</p> {/* Category */}
            <p style={productDetailsDescriptionStyle}>{product.description}</p> {/* Description */}
            <p style={productDetailsPriceStyle}>Price: ${product.price.toFixed(2)}</p> {/* Price */}
            <p style={productDetailsAvailabilityStyle}> {/* Availability */}
                Availability: {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            {product.images && product.images.length > 0 && ( // Conditionally render images
                <div style={productDetailsImagesContainerStyle}> {/* Images container */}
                    {product.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            style={productDetailsImageStyle} // Style for each image
                        />
                    ))}
                </div>
            )}
            {/* Add "Add to Cart" button here later */}
            <button style={addToCartButtonStyle} onClick={handleAddToCart}> {/* Add to cart button */}
                Add to Cart
            </button>
            
        </div>
    );
}

// --- Inline Styles for Product Details (you can customize these) ---
const productDetailsContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#222', // Darker background for details page
    color: '#eee',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Slightly stronger shadow
};

const productDetailsNameStyle = {
    fontSize: '2.5rem', // Larger product name
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center', // Center name on details page
};

const productDetailsCategoryStyle = {
    color: '#aaa',
    marginBottom: '10px',
    fontStyle: 'italic',
    textAlign: 'center', // Center category
};

const productDetailsDescriptionStyle = {
    color: '#ddd',
    lineHeight: '1.8',
    marginBottom: '25px',
    whiteSpace: 'pre-line', // Preserve line breaks in description
};

const productDetailsPriceStyle = {
    color: '#00bcd4',
    fontWeight: 'bold',
    fontSize: '1.6rem', // Larger price
    marginBottom: '20px',
};

const productDetailsAvailabilityStyle = {
    color: '#8bc34a',
    fontWeight: 'bold',
    marginBottom: '20px',
};

const productDetailsImagesContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px solid #333', // More prominent separator for images
};

const productDetailsImageStyle = {
    maxWidth: '250px', // Larger images on details page
    marginRight: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)', // Stronger shadow for images
};

const addToCartButtonStyle = {
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: '#007bff', // Example button color
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',

    '&:hover': {
        backgroundColor: '#0056b3', // Darker shade on hover
    },
};


export default ProductDetails;