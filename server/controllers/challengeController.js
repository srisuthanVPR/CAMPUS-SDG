const { challenges, users } = require('../data/mockData');

function getChallenges(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, challenges }));
}

function createChallenge(req, res) {
    if (req.user.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Admin access required' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const challenge = JSON.parse(body);
            challenge.id = challenges.length + 1;
            challenge.createdBy = req.user.id;
            challenge.participants = [];
            challenges.push(challenge);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, challenge }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid request format' }));
        }
    });
}

function joinChallenge(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { challengeId } = JSON.parse(body);
            const challenge = challenges.find(c => c.id === challengeId);
            
            if (!challenge) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Challenge not found' }));
                return;
            }

            if (!challenge.participants.includes(req.user.id)) {
                challenge.participants.push(req.user.id);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, challenge }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid request format' }));
        }
    });
}

module.exports = {
    getChallenges,
    createChallenge,
    joinChallenge
};