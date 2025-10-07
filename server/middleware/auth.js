const { users } = require('../data/mockData');

function verifyAuth(req) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, message: 'No token provided' };
        }

        const token = authHeader.split(' ')[1];
        const user = users.find(u => u.token === token);
        
        if (!user) {
            return { success: false, message: 'Invalid token' };
        }

        // Add user object to request for use in route handlers
        req.user = user;
        return { success: true, user };
    } catch (error) {
        return { success: false, message: 'Authentication failed' };
    }
}

function requireRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized access' }));
            return;
        }
        next();
    };
}

module.exports = {
    verifyAuth,
    requireRole
};