const { handleLogin } = require('../controllers/authController');
const { getMetrics, getLeaderboard } = require('../controllers/metricsController');
const { getChallenges, createChallenge, joinChallenge } = require('../controllers/challengeController');
const { getRewards, redeemReward } = require('../controllers/rewardController');
const { getQuizzes, submitQuiz } = require('../controllers/quizController');

const routes = {
    // Public routes
    'POST /api/login': { handler: handleLogin },
    
    // Student & Admin routes
    'GET /api/metrics': { handler: getMetrics, roles: ['student', 'admin'] },
    'GET /api/challenges': { handler: getChallenges, roles: ['student', 'admin'] },
    'GET /api/leaderboard': { handler: getLeaderboard, roles: ['student', 'admin'] },
    'GET /api/rewards': { handler: getRewards, roles: ['student', 'admin'] },
    'GET /api/quizzes': { handler: getQuizzes, roles: ['student', 'admin'] },
    
    // Student-only routes
    'POST /api/challenges/join': { handler: joinChallenge, roles: ['student'] },
    'POST /api/rewards/redeem': { handler: redeemReward, roles: ['student'] },
    'POST /api/quizzes/submit': { handler: submitQuiz, roles: ['student'] },
    
    // Admin-only routes
    'POST /api/challenges': { handler: createChallenge, roles: ['admin'] },
    'PUT /api/challenges': { handler: createChallenge, roles: ['admin'] },
    'DELETE /api/challenges': { handler: createChallenge, roles: ['admin'] }
};

function router(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = `${req.method} ${url.pathname}`;
    
    const routeConfig = routes[route];
    if (!routeConfig) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
        return;
    }

    if (routeConfig.roles && !routeConfig.roles.includes(req.user?.role)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        routeConfig.handler(req, res);
    } catch (error) {
        console.error('Route handler error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

module.exports = router;