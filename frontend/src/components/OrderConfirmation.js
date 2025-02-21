// frontend/src/components/OrderConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';

function OrderConfirmation() {
    return (
        <div style={orderConfirmationContainerStyle}>
            <h2 style={orderConfirmationHeadingStyle}>Thank You for Your Order!</h2>
            <p style={orderConfirmationTextStyle}>Your order has been placed successfully.</p>
            <p style={orderConfirmationTextStyle}>You will receive an email confirmation shortly.</p>
            <p style={orderConfirmationTextStyle}>
                <Link to="/" style={backToHomeLinkStyle}>Continue Shopping</Link>
            </p>
        </div>
    );
}

// --- Inline Styles for Order Confirmation Page ---
const orderConfirmationContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#222',
    color: '#eee',
    borderRadius: '10px',
    textAlign: 'center',
};

const orderConfirmationHeadingStyle = {
    color: '#fff',
    fontSize: '2.5rem',
    marginBottom: '20px',
};

const orderConfirmationTextStyle = {
    color: '#ddd',
    fontSize: '1.1rem',
    lineHeight: '1.7',
    marginBottom: '15px',
};

const backToHomeLinkStyle = {
    color: '#00bcd4',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',

    '&:hover': {
        textDecoration: 'underline',
    },
};


export default OrderConfirmation;