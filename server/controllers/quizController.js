const { quizzes, users } = require('../data/mockData');

function getQuizzes(req, res) {
    // Remove correct answers for students
    const sanitizedQuizzes = quizzes.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map(q => {
            const { correct, ...questionData } = q;
            return req.user.role === 'admin' ? q : questionData;
        })
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, quizzes: sanitizedQuizzes }));
}

function submitQuiz(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { quizId, answers } = JSON.parse(body);
            const quiz = quizzes.find(q => q.id === quizId);
            
            if (!quiz) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Quiz not found' }));
                return;
            }

            // Calculate score
            let score = 0;
            const results = quiz.questions.map((question, index) => {
                const correct = answers[index] === question.correct;
                if (correct) score++;
                return { questionId: question.id, correct };
            });

            const percentage = (score / quiz.questions.length) * 100;

            // Award points based on performance
            const user = users.find(u => u.id === req.user.id);
            const pointsEarned = Math.floor(percentage);
            user.points += pointsEarned;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                score,
                total: quiz.questions.length,
                percentage,
                pointsEarned,
                results
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid request format' }));
        }
    });
}

module.exports = {
    getQuizzes,
    submitQuiz
};