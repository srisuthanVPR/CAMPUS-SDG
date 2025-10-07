const mockData = require('../data/mockData');

class UserService {
    static authenticate(username, password) {
        const user = mockData.users.find(u => u.username === username);
        if (!user || user.password !== password) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static getUserById(id) {
        const user = mockData.users.find(u => u.id === id);
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static updateUserPoints(userId, points) {
        const user = mockData.users.find(u => u.id === userId);
        if (user) {
            user.points += points;
            return true;
        }
        return false;
    }
}

module.exports = UserService;