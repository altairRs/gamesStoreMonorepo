// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission

        setError(''); // Clear any previous errors

        try {
            const response = await fetch('http://localhost:4000/api/users/login', { // Fetch API for login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail: email, password }), // Send email as usernameOrEmail
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data);
                // Store token in local storage or context if needed for authentication
                localStorage.setItem('authToken', data.token); // Example: Store token in localStorage
                alert('Login successful!'); // Basic success feedback
                navigate('/'); // Redirect to homepage after successful login
            } else {
                // Login failed
                setError(data.message || 'Login failed'); // Set error message from backend response or default
                console.error('Login failed:', data);
            }
        } catch (e) {
            setError('Failed to connect to server'); // Error for network issues, etc.
            console.error('Login error:', e);
        }
    };

    return (
        <div className="wrapper" style={loginWrapperStyle}> {/* Apply wrapper style */}
            <form id="loginForm" onSubmit={handleLogin} style={loginFormStyle}> {/* Apply form style and onSubmit handler */}
                <h1 style={loginHeadingStyle}>Login</h1> {/* Apply heading style */}
                {error && <p style={loginErrorStyle}>{error}</p>} {/* Display error message if there is an error */}
                <div className="input-box" style={inputBoxStyle}> {/* Apply input box style */}
                    <input
                        type="text"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle} // Apply input field style
                    />
                    <i className='bx bx-user' style={iconStyle}></i> {/* Apply icon style */}
                </div>

                <div className="input-box" style={inputBoxStyle}>
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                    <i className='bx bx-lock-alt' style={iconStyle}></i>
                </div>

                <div className="remember-forgot" style={rememberForgotStyle}> {/* Apply remember-forgot style */}
                    <label style={rememberLabelStyle}><input type="checkbox" style={checkboxStyle} /> Remember </label> {/* Apply remember label and checkbox styles */}
                    <Link to="/forgot-password" style={forgotPasswordLinkStyle}>Forgot Password?</Link> {/* Correct Link to /forgot-password */}
                </div>

                <button type="submit" className="btn" style={loginButtonStyle}>Login</button> {/* Apply login button style */}

                <div className="register-link" style={registerLinkStyle}> {/* Apply register link style */}
                    <p style={registerTextStyle}>Don't have an account? <Link to="/register" style={registerLinkAnchorStyle}>Register</Link></p> {/* Apply register text and anchor styles */}
                </div>


            </form>


        </div>
    );
}


// --- Revised Inline Styles ---
const loginWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#222',
};

const loginFormStyle = {
    width: '350px', // Slightly reduced width for form
    background: '#333',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    color: '#eee',
};

const loginHeadingStyle = {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '25px', // Increased bottom margin for heading
};

const loginErrorStyle = {
    color: '#f44336',
    marginBottom: '15px',
    textAlign: 'center',
};

const inputBoxStyle = {
    position: 'relative',
    marginBottom: '15px', // Reduced bottom margin for input boxes
};

const inputStyle = {
    width: '100%',
    padding: '12px 20px 12px 40px', // Adjusted padding: top, right, bottom, left (increased left padding for icon space)
    margin: '8px 0', // Added margin around input
    display: 'inline-block',
    border: '1px solid #ccc', // Slightly less transparent border
    borderRadius: '4px',      // More standard rounded corners
    boxSizing: 'border-box',  // Important: Include padding and border in element's total width and height
    background: '#444',       // Slightly darker input background
    color: '#eee',
};


const iconStyle = {
    position: 'absolute',
    left: '15px', // Adjusted left position for icon
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.1rem',    // Slightly smaller icon size
    color: '#bbb',         // Muted icon color
};

const rememberForgotStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',    // Reduced bottom margin for remember-forgot
    fontSize: '0.9rem',
    color: '#ddd',         // Lighter text color for remember-forgot
};

const rememberLabelStyle = {
    color: '#ddd',
};

const checkboxStyle = {
    marginRight: '5px',    // Reduced right margin for checkbox
};

const forgotPasswordLinkStyle = {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '0.9rem',
};

const loginButtonStyle = {
    width: '100%',
    padding: '12px 20px',   // Adjusted button padding
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',      // More standard rounded corners for button
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    marginTop: '10px',      // Added top margin for button
};

const registerLinkStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',    // Increased top margin for register link
};

const registerTextStyle = {
    color: '#ddd',
};

const registerLinkAnchorStyle = {
    color: '#ddd',
    textDecoration: 'none',
    fontWeight: 'bold',
};


export default Login;