# API Documentation

## Authentication
Authentication is handled via JWT tokens.

### Endpoints

#### POST /api/auth/login
Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

[Additional API endpoints documentation...]
