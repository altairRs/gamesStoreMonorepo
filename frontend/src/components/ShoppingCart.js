// frontend/src/components/ShoppingCart.js
import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart hook

function ShoppingCart() {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart(); // Get cart functions and data

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, parseInt(newQuantity, 10)); // Parse to integer
    };

    const handleClearCart = () => {
        clearCart();
    };

    if (cart.length === 0) {
        return (
            <div style={shoppingCartContainerStyle}>
                <h2 style={shoppingCartHeadingStyle}>Your Shopping Cart</h2>
                <p style={emptyCartTextStyle}>Your cart is currently empty.</p>
            </div>
        );
    }

    return (
        <div style={shoppingCartContainerStyle}>
            <h2 style={shoppingCartHeadingStyle}>Your Shopping Cart</h2>
            <ul style={cartItemsListStyle}>
                {cart.map(item => (
                    <li key={item._id} style={cartItemStyle}>
                        <div style={cartItemDetailsStyle}>
                            <h4 style={cartItemNameStyle}>{item.name}</h4>
                            <p style={cartItemPriceStyle}>Price: ${item.price.toFixed(2)}</p>
                        </div>
                        <div style={cartItemQuantityControlsStyle}>
                            <label htmlFor={`quantity-${item._id}`} style={quantityLabelStyle}>Quantity:</label>
                            <input
                                type="number"
                                id={`quantity-${item._id}`}
                                style={quantityInputStyle}
                                value={item.quantity}
                                min="1"
                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            />
                        </div>
                        <button style={removeItemButtonStyle} onClick={() => handleRemoveFromCart(item._id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <div style={cartSummaryStyle}>
                <p style={cartTotalTextStyle}>Total: ${cartTotal.toFixed(2)}</p>
                <button style={clearCartButtonStyle} onClick={handleClearCart}>Clear Cart</button>
                {/* Add "Proceed to Checkout" button later */}
            </div>
        </div>
    );
}

// --- Inline Styles for Shopping Cart (customize as needed) ---
const shoppingCartContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '960px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#222', // Dark background
    color: '#eee',
    borderRadius: '8px',
};

const shoppingCartHeadingStyle = {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '20px',
    textAlign: 'center',
};

const emptyCartTextStyle = {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#ccc',
    padding: '20px',
};

const cartItemsListStyle = {
    listStyle: 'none',
    padding: 0,
};

const cartItemStyle = {
    backgroundColor: '#333', // Lighter background for cart items
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '6px',
    display: 'flex',         // Flex layout for item details and controls
    justifyContent: 'space-between', // Space out details and controls
    alignItems: 'center',    // Vertically align items
};

const cartItemDetailsStyle = {
    flexGrow: 1,             // Allow details to take up available space
    marginRight: '15px',
};

const cartItemNameStyle = {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '5px',
};

const cartItemPriceStyle = {
    color: '#aaa',
    fontStyle: 'italic',
};

const cartItemQuantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
};

const quantityLabelStyle = {
    color: '#eee',
    marginRight: '5px',
};

const quantityInputStyle = {
    width: '50px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#eee',
};


const removeItemButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#d9534f', // Reddish for remove button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
};

const cartSummaryStyle = {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #555',
    textAlign: 'right',      // Align total and buttons to the right
};

const cartTotalTextStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px',
};

const clearCartButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d', // Grayish for clear cart button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: '10px',
};


export default ShoppingCart;