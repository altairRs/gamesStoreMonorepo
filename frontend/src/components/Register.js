// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/users/register', { // Fetch API for registration
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }), // Send username, email, password in body
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log('Registration successful:', data);
                alert('Registration successful! Please login.'); // Success alert
                navigate('/login'); // Redirect to login page after registration
            } else {
                // Registration failed
                setError(data.message || 'Registration failed'); // Set error message from backend response or default
                console.error('Registration failed:', data);
            }
        } catch (e) {
            setError('Failed to connect to server');
            console.error('Registration error:', e);
        }
    };

    return (
        <div className="wrapper" style={registerWrapperStyle}> {/* Apply wrapper style */}
            <form id="registerForm" onSubmit={handleRegister} style={registerFormStyle}> {/* Apply form style and onSubmit handler */}
                <h1 style={registerHeadingStyle}>Register</h1> {/* Apply heading style */}
                {error && <p style={registerErrorStyle}>{error}</p>} {/* Display error message if there is an error */}

                <div className="input-box" style={inputBoxStyle}> {/* Apply input box style */}
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle} // Apply input field style
                    />
                    <i className='bx bx-user' style={iconStyle}></i> {/* Apply icon style */}
                </div>


                <div className="input-box" style={inputBoxStyle}>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                    <i className='bx bx-envelope' style={iconStyle}></i>
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

                <button type="submit" className="btn" style={registerButtonStyle}>Register</button> {/* Apply register button style */}

                <div className="register-link" style={loginLinkStyle}> {/* Apply login link style */}
                    <p style={loginTextStyle}>Already have an account? <Link to="/login" style={loginLinkAnchorStyle}>Login</Link></p> {/* Apply login text and anchor styles */}
                </div>
            </form>
        </div>
    );
}

// --- Inline Styles (Adapt or replace with your CSS) ---
const registerWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#222',
};

const registerFormStyle = {
    width: '350px', // Slightly reduced width for form
    background: '#333',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    color: '#eee',
};

const registerHeadingStyle = {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '25px', // Increased bottom margin for heading
};

const registerErrorStyle = {
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

const registerButtonStyle = {
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

const loginLinkStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',    // Increased top margin for register link
};

const loginTextStyle = {
    color: '#ddd',
};

const loginLinkAnchorStyle = {
    color: '#ddd',
    textDecoration: 'none',
    fontWeight: 'bold',
};


export default Register;