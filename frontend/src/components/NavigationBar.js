// frontend/src/components/NavigationBar.js
import React, { useState } from 'react';
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

    return (
        <nav style={navBarStyle}>
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
                {/* New "Sign In" Button/Link */}
                <li style={navListItemStyle}>
                    <Link to="/login" style={signInButtonStyle}>Sign In</Link>
                </li>
                {/* Placeholder for "Profile" Link (will be conditional later) */}
                {/* <li style={navListItemStyle}>
                    <Link to="/profile" style={navLinkStyle}>Profile</Link>
                </li> */}
            </ul>
        </nav>
    );
}

// --- Styles for "Sign In" Button/Link ---
const signInButtonStyle = {
    padding: '8px 15px',
    borderRadius: '4px',
    backgroundColor: '#00aaff', // Example button color
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',

    '&:hover': {
        backgroundColor: '#0088cc', // Darker shade on hover
    },
};

// --- Add styles for search input and button ---
const searchInputStyle = {
    padding: '8px',
    borderRadius: '4px 0 0 4px', // Rounded left corners
    border: '1px solid #555',
    borderRight: 'none',        // Remove right border to join with button
    backgroundColor: '#444',
    color: '#eee',
    width: '200px',
};

const searchButtonStyle = {
    padding: '8px 15px',
    borderRadius: '0 4px 4px 0', // Rounded right corners
    border: '1px solid #555',
    borderLeft: 'none',         // Remove left border to join with input
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
};


// --- Inline Styles for Navigation Bar (you can customize these) ---
const navBarStyle = {
    backgroundColor: '#333', // Dark background for navbar
    color: '#fff',           // White text color for navbar
    padding: '15px 20px',     // Padding around navbar content
};

const navListStyle = {
    listStyle: 'none',       // Remove default list bullets
    padding: 0,
    margin: 0,
    display: 'flex',         // Use flexbox for horizontal navigation
    alignItems: 'center',    // Vertically align items in the navbar
};

const navListItemStyle = {
    marginRight: '20px',     // Spacing between navigation items
};

const navLinkStyle = {
    color: '#eee',           // Light gray link color
    textDecoration: 'none',  // Remove underlines from links
    fontWeight: 'bold',      // Bold link text
    fontSize: '1.1rem',      // Slightly larger font size for links

    '&:hover': {              // Hover effect (if you want to add more complex hover, use CSS classes)
        color: '#fff',       // Example: slightly brighter on hover
    },
};


export default NavigationBar;