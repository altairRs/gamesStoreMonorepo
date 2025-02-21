// frontend/src/components/Profile.js
import React from 'react';

function Profile() {
    return (
        <div style={profileContainerStyle}>
            <h2 style={profileHeadingStyle}>Profile Page</h2>
            <p style={profileTextStyle}>This is a placeholder for the user profile page.</p>
            {/* You will add user profile information and actions here later */}
        </div>
    );
}

// --- Basic Inline Styles for Placeholder Profile Page ---
const profileContainerStyle = {
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#222', // Dark background
    color: '#eee',
    borderRadius: '8px',
    textAlign: 'center', // Center text content
};

const profileHeadingStyle = {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '20px',
};

const profileTextStyle = {
    color: '#ddd',
    fontSize: '1.1rem',
};


export default Profile;