// frontend/src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create a new context
export const CartContext = createContext();

// CartProvider component to wrap around your application
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localCart = localStorage.getItem('shoppingCart');
        return localCart ? JSON.parse(localCart) : [];
    });
    const { token } = useAuth(); // Get token from AuthContext

    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }, [cart]);

    const logCartAction = async (activityType, activityDetails) => {
        try {
            const response = await fetch('http://localhost:4000/api/logs/cart-action', { // New API endpoint for cart actions
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined, // Include token if logged in
                },
                body: JSON.stringify({ activityType, activityDetails }),
            });
            if (!response.ok) {
                console.error('Failed to log cart action:', activityType, response.status, await response.text());
            }
        } catch (error) {
            console.error('Error logging cart action:', activityType, error);
        }
    };


    // Function to add an item to the cart
    const addToCart = (product, quantity = 1) => {
        const cartItem = { ...product, quantity };
        setCart(currentCart => {
            const productExists = currentCart.find(item => item._id === product._id);
            if (productExists) {
                return currentCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...currentCart, cartItem];
            }
        });
        logCartAction('addToCart', { productId: product._id, productName: product.name, quantity }); // Log addToCart action
    };

    // Function to remove an item from the cart
    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
        logCartAction('removeFromCart', { productId }); // Log removeFromCart action
    };

    // Function to update item quantity in cart
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(currentCart =>
                currentCart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
            logCartAction('updateCartQuantity', { productId, quantity: newQuantity }); // Log updateCartQuantity action
        }
    };

    // Function to clear the entire cart
    const clearCart = () => {
        setCart([]);
        logCartAction('clearCart', {}); // Log clearCart action (no specific details needed)
    };

    // Calculate total cart items count
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Calculate total cart value
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Provide cart state and functions to components that consume this context
    const cartContextValue = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemsCount,
        cartTotal,
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to easily use the cart context in components
export const useCart = () => {
    return React.useContext(CartContext);
};