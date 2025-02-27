// frontend/src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const priceFilterMin = searchParams.get('minPrice') || '';
    const priceFilterMax = searchParams.get('maxPrice') || '';
    const sortFilterBy = searchParams.get('sortBy') || ''; // Get sortBy from query
    const sortFilterOrder = searchParams.get('sortOrder') || ''; // Get sortOrder from query
    const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
    const [minPrice, setMinPrice] = useState(priceFilterMin);
    const [maxPrice, setMaxPrice] = useState(priceFilterMax);
    const [sortBy, setSortBy] = useState(sortFilterBy);       // State for sortBy dropdown
    const [sortOrder, setSortOrder] = useState(sortFilterOrder); // State for sortOrder (asc/desc) - not directly used in UI dropdown in this example
    const navigate = useNavigate();
    const { token } = useAuth();

    const categories = ['All Categories', 'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle'];
    const sortByOptions = [ // Options for sorting dropdown
        { value: '', label: 'No Sorting' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A-Z' },
        { value: 'name-desc', label: 'Name: Z-A' },
    ];


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = new Headers(); // Create Headers object
                headers.append('Content-Type', 'application/json');

                if (token) { // Check if token exists (user is logged in)
                    headers.append('Authorization', `Bearer ${token}`); // Add Authorization header if token exists
                }


                const response = await fetch(`http://localhost:4000/api/products?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&minPrice=${encodeURIComponent(minPrice)}&maxPrice=${encodeURIComponent(maxPrice)}&sortBy=${encodeURIComponent(sortBy.split('-')[0])}&sortOrder=${encodeURIComponent(sortBy.split('-')[1])}`, {
                    headers: headers // Pass headers to fetch
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, token]);


    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(newCategory)}&minPrice=${encodeURIComponent(minPrice)}&maxPrice=${encodeURIComponent(maxPrice)}&sortBy=${encodeURIComponent(sortBy)}`); // Update URL with sorting
    };

    const handleMinPriceChange = (event) => {
        setMinPrice(event.target.value);
    };

    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    const applyPriceFilter = () => {
        navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&minPrice=${encodeURIComponent(minPrice)}&maxPrice=${encodeURIComponent(maxPrice)}&sortBy=${encodeURIComponent(sortBy)}`); // Update URL with sorting
    };

    const clearPriceFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&minPrice=&maxPrice=&sortBy=${encodeURIComponent(sortBy)}`); // Update URL with sorting
    };

    const handleSortByChange = (event) => {
        const newSortValue = event.target.value;
        setSortBy(newSortValue); // Update sortBy state
        setSortOrder(newSortValue.split('-')[1] || ''); // Update sortOrder state based on selected value (asc/desc or empty)
        navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}&minPrice=${encodeURIComponent(minPrice)}&maxPrice=${encodeURIComponent(maxPrice)}&sortBy=${encodeURIComponent(newSortValue)}&sortOrder=${encodeURIComponent(newSortValue.split('-')[1] || '')}`); // Update URL with sorting, extract sortOrder from value
    };


    return (
        <div style={productListContainerStyle}>
            <h2 style={productListHeadingStyle}>Product Catalog</h2>

            <div style={filterSectionStyle}>
                <label htmlFor="categoryFilter" style={filterLabelStyle}>Filter by Category:</label>
                <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={categoryDropdownStyle}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div style={priceFilterSectionStyle}>
                <label style={filterLabelStyle}>Filter by Price:</label>
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    style={priceInputStyle}
                />
                <span style={priceRangeSeparatorStyle}>-</span>
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    style={priceInputStyle}
                />
                <button onClick={applyPriceFilter} style={applyFilterButtonStyle}>Apply</button>
                <button onClick={clearPriceFilter} style={clearFilterButtonStyle}>Clear</button>
            </div>

            <div style={sortSectionStyle}> {/* Sorting section */}
                <label htmlFor="sortByFilter" style={filterLabelStyle}>Sort By:</label>
                <select
                    id="sortByFilter"
                    value={sortBy}
                    onChange={handleSortByChange}
                    style={sortDropdownStyle} // Style for sort dropdown
                >
                    {sortByOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option> // Options for sorting
                    ))}
                </select>
            </div>


            <ul style={productListUlStyle}> 
                {products.map(product => (
                    <li key={product._id} style={productListItemStyle}>
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Link to product details */}
                            <h3 style={productNameStyle}>{product.name}</h3>
                            <p style={productCategoryStyle}>Category: {product.category}</p>
                            <p style={productDescriptionStyle}>{product.description}</p>
                            <p style={productPriceStyle}>Price: ${product.price.toFixed(2)}</p>
                            <p style={productAvailabilityStyle}>
                                Availability: {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                            {product.images && product.images.length > 0 && (
                                <div style={productImagesContainerStyle}>
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} - Image ${index + 1}`}
                                            style={productImageStyle}
                                        />
                                    ))}
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// --- Add styles for sort section and dropdown ---
const sortSectionStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
};

const sortDropdownStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#eee',
    fontSize: '1rem',
    marginLeft: '10px', // Added marginLeft for spacing
};

// --- Add styles for price filter section and elements ---
const priceFilterSectionStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
};

const priceInputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#eee',
    width: '80px',
    marginRight: '5px',
};

const priceRangeSeparatorStyle = {
    color: '#eee',
    marginRight: '5px',
    marginLeft: '5px',
};

const applyFilterButtonStyle = {
    padding: '8px 15px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginRight: '5px',
};

const clearFilterButtonStyle = {
    padding: '8px 15px',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
};


// --- Add styles for filter section and category dropdown ---
const filterSectionStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
};

const filterLabelStyle = {
    color: '#eee',
    marginRight: '10px',
    fontSize: '1.1rem',
};

const categoryDropdownStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#eee',
    fontSize: '1rem',
};


// --- Inline Styles - Black Theme (Vercel-inspired) ---
const productListContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '960px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#111',       // Dark background - almost black
    color: '#eee',                 // Default text color - light gray
    borderRadius: '8px',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Removed or softened shadow for dark theme
};

const productListHeadingStyle = {
    color: '#fff',             // White heading text
    fontSize: '2.2rem',         // Slightly larger heading
    marginBottom: '25px',       // More margin below heading
    textAlign: 'center',
    fontWeight: 'bold',       // Bold heading
};

const productListUlStyle = {
    listStyle: 'none',
    padding: 0,
};

const productListItemStyle = {
    marginBottom: '30px',
    padding: '25px',           // Slightly more padding inside list items
    backgroundColor: '#222',     // Slightly lighter dark background for list items
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(255,255,255,0.05)', // Very subtle white shadow for depth
    border: '1px solid #333',  // Add a subtle border for definition
};

const productNameStyle = {
    fontSize: '1.7rem',         // Slightly larger product name
    color: '#fff',             // White product name
    marginBottom: '12px',
    fontWeight: 'bold',
};

const productCategoryStyle = {
    color: '#aaa',             // Light gray category text
    marginBottom: '8px',
    fontStyle: 'italic',
};

const productDescriptionStyle = {
    color: '#ddd',             // Light gray description text
    lineHeight: '1.7',
    marginBottom: '20px',
};

const productPriceStyle = {
    color: '#00bcd4',         // Cyan/Teal for price (Vercel accent color in dark theme feel)
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginBottom: '12px',
};

const productAvailabilityStyle = {
    color: '#8bc34a',         // Light green for "In Stock" in dark theme
    fontWeight: 'bold',
    marginBottom: '12px',
};

const productImagesContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    marginTop: '15px',
    borderTop: '1px solid #333', // Separator line above images
    paddingTop: '15px',
};

const productImageStyle = {
    maxWidth: '180px',         // Slightly wider images in dark theme
    marginRight: '15px',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)', // Add a bit more shadow to images for depth
};


export default ProductList;