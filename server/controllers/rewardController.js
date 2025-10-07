const { rewards, users } = require('../data/mockData');

function getRewards(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, rewards }));
}

function redeemReward(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { rewardId } = JSON.parse(body);
            const reward = rewards.find(r => r.id === rewardId);
            const user = users.find(u => u.id === req.user.id);

            if (!reward || !user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Reward or user not found' }));
                return;
            }

            if (user.points < reward.points) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Insufficient points' }));
                return;
            }

            if (reward.available <= 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Reward out of stock' }));
                return;
            }

            // Update user points and reward availability
            user.points -= reward.points;
            reward.available -= 1;
            reward.claimed.push({
                userId: user.id,
                claimedAt: new Date().toISOString()
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Reward redeemed successfully',
                userPoints: user.points
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid request format' }));
        }
    });
}

module.exports = {
    getRewards,
    redeemReward
};