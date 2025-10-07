const { validateToken } = require('../utils/auth');
const permissions = require('../config/permissions');

function checkRole(allowedRoles) {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const token = authHeader.split(' ')[1];
            const user = validateToken(token);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }
    };
}

function checkRolePermission(req, res, next) {
    const role = req.user?.role;
    const endpoint = `${req.method} ${req.path}`;
    
    if (!role) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Check if endpoint is allowed for user's role
    const allowedEndpoints = permissions[role].endpoints;
    const isAllowed = allowedEndpoints.some(pattern => {
        // Convert pattern to regex to support wildcards
        const regexPattern = pattern.replace('*', '.*');
        return new RegExp(`^${regexPattern}$`).test(endpoint);
    });

    if (!isAllowed) {
        return res.status(403).json({
            success: false,
            message: 'Access denied for your role'
        });
    }

    next();
}

module.exports = { checkRole, checkRolePermission };