const permissions = {
    admin: {
        allowedRoutes: ['/admin', '/challenges/manage', '/users', '/analytics', '/content/moderate'],
        features: ['createChallenge', 'editChallenge', 'deleteChallenge', 'manageUsers', 'manageRewards', 'viewAnalytics'],
        endpoints: [
            'POST /api/challenges',
            'PUT /api/challenges',
            'DELETE /api/challenges',
            'GET /api/admin/*',
            'POST /api/rewards/manage',
            'POST /api/users/manage'
        ]
    },
    student: {
        allowedRoutes: ['/dashboard', '/challenges', '/leaderboard', '/rewards', '/community', '/profile'],
        features: ['joinChallenge', 'submitQuiz', 'redeemReward', 'postCommunity', 'viewLeaderboard'],
        endpoints: [
            'POST /api/challenges/join',
            'POST /api/quizzes/submit',
            'POST /api/rewards/redeem',
            'POST /api/community/post'
        ]
    }
};

module.exports = permissions;