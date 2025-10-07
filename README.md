# Campus Sustainability Dashboard

## Setup Instructions

1. Install Node.js if not already installed
2. Clone this repository
3. Navigate to project directory:
   ```
   cd "d:\cse proj"
   ```
4. Start the server:
   ```
   node server/app.js
   ```
5. Access the application at http://localhost:3000

## Test Credentials

### Admin User
- Email: admin@gmail.com
- Password: admin123

### Student User
- Email: student@gmail.com
- Password: student123

## API Endpoints

### Public
- POST /api/login - Login with email and password

### Student & Admin
- GET /api/metrics - View environmental metrics
- GET /api/challenges - List all challenges
- GET /api/leaderboard - View leaderboard
- GET /api/rewards - View available rewards
- GET /api/quizzes - View available quizzes

### Student Only
- POST /api/challenges/join - Join a challenge
- POST /api/rewards/redeem - Redeem a reward
- POST /api/quizzes/submit - Submit quiz answers

### Admin Only
- POST /api/challenges - Create new challenge
- PUT /api/challenges - Update challenge
- DELETE /api/challenges - Delete challenge
