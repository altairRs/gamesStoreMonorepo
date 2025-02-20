// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import NavigationBar from './components/NavigationBar';
import ShoppingCart from './components/ShoppingCart'; // Import ShoppingCart

function App() {
    return (
        <BrowserRouter>
            <div className="App" style={{ backgroundColor: '#111', color: '#eee', minHeight: '100vh', paddingBottom: '20px' }}>
                <NavigationBar />
                <h1 style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Game Store</h1>
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/cart" element={<ShoppingCart />} /> {/* Route for ShoppingCart */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;