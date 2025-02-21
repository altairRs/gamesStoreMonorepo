// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken') || null); // Initialize from local storage

    useEffect(() => {
        // Check if token exists on initial load and verify it (optional for this simplified example, but good practice)
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // In a real app, you might want to verify the token with the backend here to ensure it's still valid
            setIsLoggedIn(true);
            setToken(storedToken);
            // You could also try to fetch user data based on the token and set it to the 'user' state
        }
    }, []); // Run once on component mount

    const login = (token, userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        setToken(token);
        localStorage.setItem('authToken', token); // Store token in local storage
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken'); // Remove token from local storage
    };

    const register = (token, userData) => { // Register function - similar to login for this example
        setIsLoggedIn(true); // Consider if registration should automatically log in the user
        setUser(userData);
        setToken(token);
        localStorage.setItem('authToken', token);
    };


    const authContextValue = {
        isLoggedIn,
        user,
        token,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};