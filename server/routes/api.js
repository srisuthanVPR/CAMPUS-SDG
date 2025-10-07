const { authenticateUser, validateEmail } = require('../utils/auth');
const { checkRole } = require('../middleware/rbac');
const { users, challenges, metrics } = require('../data/mockData');

function setupRoutes(app) {
    // Public routes
    app.post('/api/login', handleLogin);

    // Student & Admin routes
    app.get('/api/metrics', checkRole(['student', 'admin']), getMetrics);
    app.get('/api/challenges', checkRole(['student', 'admin']), getChallenges);
    app.get('/api/leaderboard', checkRole(['student', 'admin']), getLeaderboard);

    // Student-only routes
    app.post('/api/challenges/join', checkRole(['student']), joinChallenge);
    app.post('/api/quizzes/submit', checkRole(['student']), submitQuiz);
    app.post('/api/rewards/redeem', checkRole(['student']), redeemReward);

    // Admin-only routes
    app.post('/api/challenges', checkRole(['admin']), createChallenge);
    app.put('/api/challenges/:id', checkRole(['admin']), updateChallenge);
    app.delete('/api/challenges/:id', checkRole(['admin']), deleteChallenge);
    app.get('/api/admin/metrics', checkRole(['admin']), getAdminMetrics);
}

function handleLogin(req, res) {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format. Use username@gmail.com'
        });
    }

    const authResult = authenticateUser(email, password);
    
    if (!authResult) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    res.json({
        success: true,
        ...authResult
    });
}

// Protected route handlers
function getMetrics(req, res) {
    res.json({ success: true, metrics });
}

function getChallenges(req, res) {
    res.json({ success: true, challenges });
}

function getLeaderboard(req, res) {
    const leaderboard = users
        .map(({ id, name, points, level }) => ({ id, name, points, level }))
        .sort((a, b) => b.points - a.points);
    res.json({ success: true, leaderboard });
}

// ... Additional route handlers ...

module.exports = { setupRoutes };