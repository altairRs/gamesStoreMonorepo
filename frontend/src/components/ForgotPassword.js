// frontend/src/components/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [wallahiChallenge, setWallahiChallenge] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Challenge, 2: Reset Password
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChallengeSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:4000/api/users/reset-password-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, wallahiChallenge }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); // "Verification successful. Proceed to reset password."
                setStep(2); // Move to step 2: Reset Password form
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (e) {
            setError('Failed to connect to server');
        }
    };

    const handleResetPasswordSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:4000/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message + ' You can now login with your new password.'); // "Password reset successfully. ..."
                setStep(3); // Move to step 3: Success message (optional step)
                // Optionally redirect to login page after a delay:
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            } else {
                setError(data.message || 'Password reset failed');
            }
        } catch (e) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="wrapper" style={forgotPasswordWrapperStyle}>
            {step === 1 && ( // Step 1: Challenge Form
                <form id="challengeForm" onSubmit={handleChallengeSubmit} style={forgotPasswordFormStyle}>
                    <h1 style={forgotPasswordHeadingStyle}>Forgot Password</h1>
                    <p style={forgotPasswordInfoStyle}>Enter your email or username and type "wallahi" to verify reset.</p>
                    {error && <p style={forgotPasswordErrorStyle}>{error}</p>}
                    {message && <p style={forgotPasswordMessageStyle}>{message}</p>}
                    <div className="input-box" style={inputBoxStyle}>
                        <input
                            type="text"
                            placeholder="Email or Username"
                            required
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            style={inputStyle}
                        />
                        <i className='bx bx-user' style={iconStyle}></i>
                    </div>
                    <div className="input-box" style={inputBoxStyle}>
                        <input
                            type="text"
                            placeholder="Type 'wallahi'"
                            required
                            value={wallahiChallenge}
                            onChange={(e) => setWallahiChallenge(e.target.value)}
                            style={inputStyle}
                        />
                        <i className='bx bx-key' style={iconStyle}></i>
                    </div>
                    <button type="submit" className="btn" style={forgotPasswordButtonStyle}>Verify</button>
                </form>
            )}

            {step === 2 && ( // Step 2: Reset Password Form
                <form id="resetPasswordForm" onSubmit={handleResetPasswordSubmit} style={resetPasswordFormStyle}>
                    <h1 style={resetPasswordHeadingStyle}>Reset Password</h1>
                    <p style={resetPasswordInfoStyle}>Enter your new password.</p>
                    {error && <p style={resetPasswordErrorStyle}>{error}</p>}
                    {message && <p style={resetPasswordMessageStyle}>{message}</p>}
                    <div className="input-box" style={inputBoxStyle}>
                        <input
                            type="password"
                            placeholder="New Password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <i className='bx bx-lock-alt' style={iconStyle}></i>
                    </div>
                    <button type="submit" className="btn" style={resetPasswordButtonStyle}>Reset Password</button>
                    <div className="login-link" style={loginLinkStyle}>
                        <p style={loginTextStyle}>Remember your password? <Link to="/login" style={loginLinkAnchorStyle}>Login</Link></p>
                    </div>
                </form>
            )}

            {step === 3 && ( // Step 3: Success Message (Optional)
                <div style={successMessageContainerStyle}>
                    <h2 style={successMessageHeadingStyle}>Password Reset Successful!</h2>
                    <p style={successMessageTextStyle}>{message}</p>
                    <p style={successMessageTextStyle}>Redirecting to login page...</p>
                </div>
            )}
        </div>
    );
}


// --- Inline Styles (customize as needed) ---
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

const resetPasswordFormStyle = {
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

const resetPasswordHeadingStyle = {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
};

const forgotPasswordInfoStyle = {
    color: '#ddd',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '0.9rem',
};

const resetPasswordInfoStyle = {
    color: '#ddd',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '0.9rem',
};


const forgotPasswordErrorStyle = {
    color: '#f44336',
    marginBottom: '15px',
    textAlign: 'center',
};
const resetPasswordErrorStyle = {
    color: '#f44336',
    marginBottom: '15px',
    textAlign: 'center',
};

const forgotPasswordMessageStyle = {
    color: '#00bcd4',
    marginBottom: '15px',
    textAlign: 'center',
};
const resetPasswordMessageStyle = {
    color: '#00bcd4',
    marginBottom: '15px',
    textAlign: 'center',
};


const inputBoxStyle = {
    position: 'relative',
    marginBottom: '20px',
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
    marginTop: '20px',
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
    marginTop: '20px',
};

const loginLinkStyle = {
    textAlign: 'center',
    marginTop: '25px',
};

const loginTextStyle = {
    color: '#ddd',
};

const loginLinkAnchorStyle = {
    color: '#ddd',
    textDecoration: 'none',
    fontWeight: 'bold',
};

const successMessageContainerStyle = {
    width: '350px',
    background: '#333',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    color: '#eee',
    textAlign: 'center',
};

const successMessageHeadingStyle = {
    fontSize: '1.8rem',
    color: '#fff',
    marginBottom: '15px',
};

const successMessageTextStyle = {
    color: '#ddd',
    marginBottom: '10px',
};


export default ForgotPassword;