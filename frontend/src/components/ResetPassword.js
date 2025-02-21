// frontend/src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

function ResetPassword() {
    const { userId } = useParams(); // Get userId from URL params
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation


    const handleResetPasswordSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/users/reset-password/${userId}`, { // Fetch API for reset password, include userId in URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }), // Send new password in body
            });

            const data = await response.json();

            if (response.ok) {
                // Password reset successful
                setMessage(data.message || 'Password reset successful!');
                setError('');
                alert('Password reset successful! Please login with your new password.'); // Success alert
                navigate('/login'); // Redirect to login page after reset
            } else {
                // Password reset failed
                setError(data.message || 'Failed to reset password.');
                setMessage('');
                console.error('Password reset failed:', data);
            }
        } catch (e) {
            setError('Failed to connect to server.');
            setMessage('');
            console.error('Password reset error:', e);
        }
    };


    return (
        <div className="wrapper" style={resetPasswordWrapperStyle}> {/* Apply wrapper style */}
            <form id="resetPasswordForm" onSubmit={handleResetPasswordSubmit} style={resetPasswordFormStyle}> {/* Apply form style and onSubmit handler */}
                <h1 style={resetPasswordHeadingStyle}>Reset Password</h1> {/* Apply heading style */}
                {message && <p style={resetPasswordMessageStyle}>{message}</p>} {/* Display success message if there is a message */}
                {error && <p style={resetPasswordErrorStyle}>{error}</p>} {/* Display error message if there is an error */}


                <div className="input-box" style={inputBoxStyle}> {/* Apply input box style */}
                    <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle} // Apply input field style
                    />
                    <i className='bx bx-lock' style={iconStyle}></i> {/* Apply icon style */}
                </div>

                <div className="input-box" style={inputBoxStyle}>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                    />
                    <i className='bx bxs-lock-alt' style={iconStyle}></i>
                </div>


                <button type="submit" className="btn" style={resetPasswordButtonStyle}>Reset Password</button> {/* Apply reset password button style */}
            </form>
        </div>
    );
}


// --- Inline Styles (Customize as needed) ---
const resetPasswordWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#222',
};

const resetPasswordFormStyle = {
    width: '350px',
    background: '#333',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    color: '#eee',
};

const resetPasswordHeadingStyle = {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '25px',
};


const resetPasswordMessageStyle = {
    color: '#4CAF50', // Green for success message
    marginBottom: '15px',
    textAlign: 'center',
};

const resetPasswordErrorStyle = {
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


const resetPasswordButtonStyle = {
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


export default ResetPassword;