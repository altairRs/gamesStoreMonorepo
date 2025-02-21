// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import NavigationBar from './components/NavigationBar';
import ShoppingCart from './components/ShoppingCart';
import Login from './components/Login'; // Import Login
import Register from './components/Register'; // Import Register
import Checkout from './components/Checkout';
import ForgotPassword from './components/ForgotPassword';

function App() {
    return (
        <BrowserRouter>
            <div className="App" style={{ backgroundColor: '#111', color: '#eee', minHeight: '100vh', paddingBottom: '20px' }}>
                <NavigationBar />
                <h1 style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Game Store</h1>
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/cart" element={<ShoppingCart />} />
                    <Route path="/login" element={<Login />} /> {/* Route for Login */}
                    <Route path="/register" element={<Register />} /> {/* Route for Register */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Route for ForgotPassword */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;