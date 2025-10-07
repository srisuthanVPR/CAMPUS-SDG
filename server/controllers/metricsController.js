const { users, metrics } = require('../data/mockData');

function getLeaderboard(req, res) {
    const leaderboard = users
        .map(({ id, name, points, badges }) => ({ id, name, points, badges }))
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({ ...user, rank: index + 1 }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, leaderboard }));
}

function getMetrics(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, metrics }));
}

module.exports = {
    getLeaderboard,
    getMetrics
};