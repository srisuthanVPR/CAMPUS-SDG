const http = require('http');
const fs = require('fs');
const path = require('path');
const { users, challenges, metrics } = require('./data/mockData');

const PORT = 3000;

// Basic MIME types for serving files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

const { setupRoutes } = require('./routes/api');

const server = http.createServer((req, res) => {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Add helper methods to res object
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };

    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Parse body for POST/PUT requests
    if (['POST', 'PUT'].includes(req.method)) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                req.body = JSON.parse(body);
            } catch (e) {
                req.body = {};
            }
        });
    }

    console.log(`${req.method} ${req.url}`); // Log incoming requests

    // Handle API endpoints
    if (req.url.startsWith('/api')) {
        handleApiRequest(req, res);
        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('File read error:', err);
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(data);
    });
});

function handleApiRequest(req, res) {
    if (req.url === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Create a token (in a real app, use proper JWT)
                    const token = Math.random().toString(36).substring(7);
                    user.token = token;
                    
                    const { password: _, ...userWithoutPassword } = user;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        user: userWithoutPassword,
                        token
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid credentials'
                    }));
                }
            } catch (error) {
                console.error('Login error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid request format'
                }));
            }
        });
        return;
    }

    // Default response for unknown endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available users for testing:');
    console.log('Admin:', users.find(u => u.role === 'admin').email);
    console.log('Student:', users.find(u => u.role === 'student').email);
});