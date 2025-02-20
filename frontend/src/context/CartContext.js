// frontend/src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create a new context
export const CartContext = createContext();

// CartProvider component to wrap around your application
export const CartProvider = ({ children }) => {
    // Initialize cart state from local storage or as empty array
    const [cart, setCart] = useState(() => {
        const localCart = localStorage.getItem('shoppingCart');
        return localCart ? JSON.parse(localCart) : [];
    });

    // useEffect to update local storage whenever cart changes
    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }, [cart]);

    // Function to add an item to the cart
    const addToCart = (product, quantity = 1) => {
        const cartItem = { ...product, quantity };
        setCart(currentCart => {
            const productExists = currentCart.find(item => item._id === product._id);
            if (productExists) {
                // If product is already in cart, update quantity
                return currentCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                // If product is new to cart, add it
                return [...currentCart, cartItem];
            }
        });
    };

    // Function to remove an item from the cart
    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
    };

    // Function to update item quantity in cart
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId); // Remove if quantity is set to 0 or less
        } else {
            setCart(currentCart =>
                currentCart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    // Function to clear the entire cart
    const clearCart = () => {
        setCart([]);
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