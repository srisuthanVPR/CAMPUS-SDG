function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

module.exports = {
    validateEmail,
    validatePassword,
    sanitizeInput
};