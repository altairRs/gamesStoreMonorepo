// frontend/src/components/Checkout.js
import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Checkout() {
    const { cart, cartTotal, clearCart } = useCart(); // Get cart data and clearCart function
    const navigate = useNavigate(); // Hook for navigation

    const handlePlaceOrder = () => {
        // In a real application, you would send order details to the backend here
        // For this simplified example, we'll just simulate order placement:

        alert("Order Placed Successfully!\n\n(This is a demo, no actual order processing or payment is implemented)");
        clearCart(); // Clear the cart after "placing" order
        navigate('/'); // Redirect back to the homepage after checkout
    };

    if (cart.length === 0) {
        return (
            <div style={checkoutContainerStyle}>
                <h2 style={checkoutHeadingStyle}>Checkout</h2>
                <p style={emptyCartTextStyle}>Your cart is empty. Add products to checkout.</p>
            </div>
        );
    }

    return (
        <div style={checkoutContainerStyle}>
            <h2 style={checkoutHeadingStyle}>Checkout</h2>

            <div style={checkoutSummarySectionStyle}>
                <h3 style={checkoutSectionHeadingStyle}>Order Summary</h3>
                <ul style={checkoutItemsListStyle}>
                    {cart.map(item => (
                        <li key={item._id} style={checkoutItemStyle}>
                            {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)} each
                        </li>
                    ))}
                </ul>
                <p style={checkoutTotalStyle}>Total: ${cartTotal.toFixed(2)}</p>
            </div>

            <div style={checkoutActionSectionStyle}>
                <button style={placeOrderButtonStyle} onClick={handlePlaceOrder}>
                    Place Order (Simulated)
                </button>
                {/* In a real app, you would have payment processing steps here */}
            </div>
        </div>
    );
}

// --- Inline Styles for Checkout Page (customize as needed) ---
const checkoutContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#222', // Dark background
    color: '#eee',
    borderRadius: '8px',
};

const checkoutHeadingStyle = {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '25px',
    textAlign: 'center',
};

const emptyCartTextStyle = {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#ccc',
    padding: '20px',
};

const checkoutSummarySectionStyle = {
    backgroundColor: '#333', // Lighter background for summary section
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '20px',
};

const checkoutSectionHeadingStyle = {
    color: '#fff',
    fontSize: '1.5rem',
    marginBottom: '15px',
};

const checkoutItemsListStyle = {
    listStyle: 'none',
    padding: 0,
};

const checkoutItemStyle = {
    padding: '10px 0',
    borderBottom: '1px solid #555',
    marginBottom: '10px',
};

const checkoutTotalStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginTop: '15px',
};

const checkoutActionSectionStyle = {
    textAlign: 'center',
};

const placeOrderButtonStyle = {
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: '#28a745', // Green for "Place Order" button
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',

    '&:hover': {
        backgroundColor: '#218838', // Darker green on hover
    },
};


export default Checkout;