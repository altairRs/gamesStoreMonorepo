import React, { useState, useEffect } from 'react';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    console.error("❌ No token found. User is not authenticated.");
                    setError(new Error("Unauthorized: No token found"));
                    setLoading(false);
                    return;
                }

                console.log("🛠 Using Token:", token);

                const response = await fetch("http://localhost:4000/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ User Data:", data);
                setUser(data);
            } catch (error) {
                console.error("❌ Error fetching user data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
    
        try {
            const token = localStorage.getItem("authToken");
    
            if (!token) {
                setError(new Error("Unauthorized: No token found"));
                return;
            }
    
            const response = await fetch("http://localhost:4000/api/users/change-password", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }
    
            setMessage("✅ Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setShowPasswordForm(false);
        } catch (error) {
            console.error("❌ Error changing password:", error);
            setError(error);
        }
    };
    

    if (loading) return <p>Loading user profile...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
    if (!user) return <p>No user data available.</p>;

    return (
        <div>
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {user.username || "Unknown User"}</p>
            <p><strong>Email:</strong> {user.email || "No Email Available"}</p>

            <div style={styles.container}>
            <button style={styles.toggleButton} onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? "Cancel" : "Change Password"}
            </button>

            {showPasswordForm && (
                <form style={styles.form} onSubmit={handleChangePassword}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Current Password:</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password:</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            )}

            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error.message}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: "20px",
        padding: "20px",
        borderRadius: "10px",
        background: "#f9f9f9",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    toggleButton: {
        padding: "10px 15px",
        fontSize: "16px",
        cursor: "pointer",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007bff",
        color: "black",
        marginBottom: "10px",
        transition: "background 0.3s",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "15px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
    },
    label: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    input: {
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    submitButton: {
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#28a745",
        color: "blue",
        cursor: "pointer",
        transition: "background 0.3s",
    },
    successMessage: {
        color: "blue",
        fontWeight: "bold",
        marginTop: "10px",
    },
    errorMessage: {
        color: "red",
        fontWeight: "bold",
        marginTop: "10px",
    }
};


export default UserProfile;
