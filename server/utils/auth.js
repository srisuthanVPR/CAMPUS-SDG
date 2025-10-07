const crypto = require('crypto');
const { users } = require('../data/mockData');

const tokens = new Map();

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function validateToken(token) {
    return users.find(u => u.token === token);
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
}

function authenticateUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return null;
    }

    const token = generateToken();
    user.token = token;
    tokens.set(token, user);

    const { password: _, ...userWithoutPassword } = user;
    return {
        token,
        user: userWithoutPassword
    };
}

module.exports = {
    generateToken,
    validateToken,
    validateEmail,
    authenticateUser
};