// test-bcrypt.js
const bcrypt = require('bcryptjs');

async function testPasswordComparison() {
    const plaintextPassword = "usernameusername"; // Replace with the *new password* you set during reset
    const hashedPasswordFromDB = "$2b$10$86hJKDJnZfOcQ.n05cLV2uxmlgUPYTWuwVA9lcUX9pSoYl1KLYHJq"; // Replace with the *hashed password you copied from MongoDB*

    try {
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPasswordFromDB);

        if (isMatch) {
            console.log("Password comparison successful! Passwords match.");
        } else {
            console.log("Password comparison failed! Passwords do NOT match.");
        }
    } catch (error) {
        console.error("Error during password comparison:", error);
    }
}

testPasswordComparison();