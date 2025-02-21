import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function NavigationBar() {
    const { cartItemsCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Check if user is logged in
        setIsLoggedIn(!!token); // Convert token existence to boolean
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token
        localStorage.removeItem('isLoggedIn'); // Remove login state
        setIsLoggedIn(false);
        window.location.reload(); // Refresh to update UI
    };

    return (
        <nav style={navBarStyle}>
            <div style={navContainerStyle}>
                <ul style={navListStyle}>
                    <li style={navListItemStyle}>
                        <Link to="/" style={navLinkStyle}>Home</Link>
                    </li>
                    <li style={navListItemStyle}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex' }}>
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                style={searchInputStyle}
                            />
                            <button type="submit" style={searchButtonStyle}>Search</button>
                        </form>
                    </li>
                    <li style={navListItemStyle}>
                        <Link to="/cart" style={navLinkStyle}>
                            🛒 Cart ({cartItemsCount})
                        </Link>
                    </li>
                </ul>
                <ul style={authListStyle}> {/* Moves Login & Register to the right */}
                {!isLoggedIn ? (  // If not logged in, show Login/Register
                        <>
                            <Link to="/login" style={navLinkStyle}>Login</Link>
                            <Link to="/register" style={navLinkStyle}>Register</Link>
                        </>
                    ) : (  // If logged in, show Profile and Logout
                        <>
                            <Link to="/profile" style={navLinkStyle}>Profile</Link>
                            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

// --- Inline Styles ---
const navBarStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '15px 20px',
};

const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Pushes items to the edges
    alignItems: 'center',
};

const navListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
};

const authListStyle = {  // Styles for Login/Register
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto', // Pushes Login/Register to the right
};

const navListItemStyle = {
    marginRight: '20px',
};

const navLinkStyle = {
    color: '#eee',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '8px',
};

const searchInputStyle = {
    padding: '8px',
    borderRadius: '4px 0 0 4px',
    border: '1px solid #555',
    borderRight: 'none',
    backgroundColor: '#444',
    color: '#eee',
    width: '200px',
};

const searchButtonStyle = {
    padding: '8px 15px',
    borderRadius: '0 4px 4px 0',
    border: '1px solid #555',
    borderLeft: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
};

const logoutButtonStyle = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
};

export default NavigationBar;
