// frontend/src/components/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart hook

function NavigationBar() {
    const { cartItemsCount } = useCart(); // Access cartItemsCount from CartContext

    return (
        <nav style={navBarStyle}> {/* Apply navigation bar style */}
            <ul style={navListStyle}> {/* Apply list style for navigation items */}
                <li style={navListItemStyle}> {/* Style for each list item */}
                    <Link to="/" style={navLinkStyle}>Home</Link> {/* Link to homepage */}
                </li>
                {/* You can add more navigation links here later */}
                <li style={navListItemStyle}> {/* Cart link and count */}
                    <Link to="/cart" style={navLinkStyle}>
                        🛒 Cart ({cartItemsCount}) {/* Cart icon (🛒) and item count */}
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

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