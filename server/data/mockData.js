const users = [
    {
        id: 1,
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        token: 'admin-token-123',
        points: 3000,
        badges: ['Energy Saver', 'Green Leader'],
        activities: []
    },
    {
        id: 2,
        email: 'student@gmail.com',
        password: 'student123',
        role: 'student',
        name: 'Student User',
        token: 'student-token-123',
        points: 1500,
        badges: ['Recycling Hero'],
        activities: []
    }
];

const challenges = [
    {
        id: 1,
        title: 'Zero Waste Week',
        description: 'Avoid generating any waste for a week',
        points: 100,
        type: 'waste',
        difficulty: 'medium',
        duration: '7 days',
        participants: [],
        createdBy: 1
    }
];

const rewards = [
    {
        id: 1,
        name: 'Campus Cafe Voucher',
        description: '10% off at campus cafe',
        points: 500,
        available: 10,
        claimed: []
    }
];

const tips = [
    {
        id: 1,
        title: 'Save Energy',
        content: 'Turn off lights when leaving a room',
        createdBy: 1,
        createdAt: new Date().toISOString()
    }
];

const quizzes = [
    {
        id: 1,
        title: 'Sustainability Basics',
        questions: [
            {
                id: 1,
                question: 'What is recycling?',
                options: ['Reusing', 'Throwing away', 'Converting waste', 'Burning'],
                correct: 2
            }
        ],
        createdBy: 1
    }
];

const posts = [
    {
        id: 1,
        title: 'My Recycling Journey',
        content: 'Started separating waste this week',
        author: 2,
        likes: 5,
        comments: [],
        createdAt: new Date().toISOString()
    }
];

const metrics = {
    energy_saved_kwh: 34500,
    water_saved_liters: 125000,
    co2_reduced_kg: 12450,
    waste_diverted_kg: 8900,
    active_users: 847,
    total_challenges_completed: 156,
    total_points_awarded: 45600
};

const notifications = [
    {
        id: 1,
        title: 'New Challenge Available',
        content: 'Join the Energy Saving Challenge',
        type: 'challenge',
        createdAt: new Date().toISOString(),
        recipients: ['all']
    }
];

module.exports = {
    users,
    challenges,
    rewards,
    tips,
    quizzes,
    posts,
    metrics,
    notifications
};