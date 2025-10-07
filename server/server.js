const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Basic MIME types for serving files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle API requests
    if (req.url.startsWith('/api')) {
        handleApiRequest(req, res);
        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(data);
    });
});

function handleApiRequest(req, res) {
    const handlers = {
        '/api/login': handleLogin,
        '/api/challenges': handleChallenges,
        '/api/leaderboard': handleLeaderboard
    };

    const handler = handlers[req.url];
    if (handler) {
        handler(req, res);
    } else {
        res.writeHead(404);
        res.end('API endpoint not found');
    }
}

function handleLogin(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end('Method not allowed');
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { username, password } = JSON.parse(body);
        if (username === 'admin' && password === 'password123') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Login successful' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
        }
    });
}

function handleChallenges(req, res) {
    const mockChallenges = require('./data/mockData').challenges;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockChallenges));
}

function handleLeaderboard(req, res) {
    const mockUsers = require('./data/mockData').users;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockUsers));
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});