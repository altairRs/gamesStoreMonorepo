// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails'; // Import ProductDetails

function App() {
    return (
        <BrowserRouter> {/* Wrap your app with BrowserRouter */}
            <div className="App" style={{ backgroundColor: '#111', color: '#eee', minHeight: '100vh', paddingBottom: '20px' }}> {/* App-level dark background style */}
                <h1 style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Game Store</h1> {/* Styled main heading */}
                <Routes> {/* Define your routes within Routes */}
                    <Route path="/" element={<ProductList />} /> {/* Route for product list (homepage) */}
                    <Route path="/products/:productId" element={<ProductDetails />} /> {/* Route for product details */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;