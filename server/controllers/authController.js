const { users } = require('../data/mockData');
const { validateEmail } = require('../utils/validators');
const crypto = require('crypto');

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { email, password } = JSON.parse(body);
            
            if (!validateEmail(email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Invalid email format. Use username@gmail.com' 
                }));
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Invalid credentials' 
                }));
                return;
            }

            // Generate new token
            const token = generateToken();
            user.token = token;

            const { password: _, ...userWithoutPassword } = user;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                user: userWithoutPassword,
                token
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Invalid request format' 
            }));
        }
    });
}

module.exports = {
    handleLogin
};