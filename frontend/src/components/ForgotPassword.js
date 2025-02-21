// frontend/src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

function ForgotPassword() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [confirmationWord, setConfirmationWord] = useState(''); // State for confirmation word input
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleForgotPasswordSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/users/forgot-password', { // Fetch API for forgot password
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail: emailOrUsername, confirmationWord: confirmationWord }), // Send confirmationWord in body
            });

            const data = await response.json();

            if (response.ok) {
                // Forgot password confirmation successful
                setMessage(data.message || 'Confirmation successful. Proceeding to reset password.');
                setError('');
                // Redirect to Reset Password page, passing userId in URL
                navigate(`/reset-password/${data.userId}`); // Navigate to reset-password page with userId in URL path
            } else {
                // Forgot password request failed
                setError(data.message || 'Confirmation failed.');
                setMessage('');
                console.error('Forgot password request failed:', data);
            }
        } catch (e) {
            setError('Failed to connect to server.');
            setMessage('');
            console.error('Forgot password error:', e);
        }
    };

    return (
        <div className="wrapper" style={forgotPasswordWrapperStyle}>
            <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit} style={forgotPasswordFormStyle}>
                <h1 style={forgotPasswordHeadingStyle}>Forgot Password</h1>
                <p style={forgotPasswordInstructionsStyle}>Enter your email or username and type "wallahi" to verify.</p>

                {message && <p style={forgotPasswordMessageStyle}>{message}</p>}
                {error && <p style={forgotPasswordErrorStyle}>{error}</p>}

                <div className="input-box" style={inputBoxStyle}>
                    <input
                        type="text"
                        placeholder="Email or Username"
                        required
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        style={inputStyle}
                    />
                    <i className='bx bx-mail-send' style={iconStyle}></i>
                </div>

                <div className="input-box" style={inputBoxStyle}> {/* New input for "wallahi" */}
                    <input
                        type="text"
                        placeholder="Type 'wallahi' to confirm"
                        required
                        value={confirmationWord}
                        onChange={(e) => setConfirmationWord(e.target.value)}
                        style={inputStyle}
                    />
                    <i className='bx bx-key' style={iconStyle}></i> {/* Example icon */}
                </div>


                <button type="submit" className="btn" style={forgotPasswordButtonStyle}>Verify & Reset Password</button> {/* Changed button text */}

                <div className="login-link" style={loginLinkStyle}>
                    <p style={loginTextStyle}>Remember your password? <Link to="/login" style={loginLinkAnchorStyle}>Login</Link></p>
                </div>
            </form>
        </div>
    );
}


// --- Inline Styles (Customize as needed) ---
const forgotPasswordWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#222',
};

const forgotPasswordFormStyle = {
    width: '350px',
    background: '#333',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    color: '#eee',
};

const forgotPasswordHeadingStyle = {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
};

const forgotPasswordInstructionsStyle = {
    color: '#ddd',
    textAlign: 'center',
    marginBottom: '25px',
};


const forgotPasswordMessageStyle = {
    color: '#4CAF50', // Green for success message
    marginBottom: '15px',
    textAlign: 'center',
};

const forgotPasswordErrorStyle = {
    color: '#f44336', // Red for error message
    marginBottom: '15px',
    textAlign: 'center',
};


const inputBoxStyle = {
    position: 'relative',
    marginBottom: '15px',
};

const inputStyle = {
    width: '100%',
    padding: '12px 20px 12px 40px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    background: '#444',
    color: '#eee',
};

const iconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.1rem',
    color: '#bbb',
};


const forgotPasswordButtonStyle = {
    width: '100%',
    padding: '12px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    marginTop: '10px',
};


const loginLinkStyle = {
    textAlign: 'center',
    marginTop: '2rem',
};

const loginTextStyle = {
    color: '#ddd',
};

const loginLinkAnchorStyle = {
    color: '#ddd',
    textDecoration: 'none',
    fontWeight: 'bold',
};


export default ForgotPassword;