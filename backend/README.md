# Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Health Check

### GET /health
Check if the server is running.

**Request:**
```http
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Authentication Routes

### 1. Sign Up (Email + Password)

**POST /api/auth/signup**

Create a new account with email and password. Sends OTP to email for verification.

**Request:**
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "User created successfully. Please check your email for verification code."
}
```

**Response (Error):**
```json
{
  "error": "User with this email already exists"
}
```

### 2. Verify OTP

**POST /api/auth/verify-otp**

Verify email with OTP code received via email.

**Request:**
```http
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456789",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid or expired OTP"
}
```

### 3. Login (Email + Password)

**POST /api/auth/login**

Login with email and password.

**Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456789",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### 4. Google OAuth (Browser Only)

**GET /api/auth/google**

Initiates Google OAuth flow. This should be opened in a browser, not Postman.

```
http://localhost:5000/api/auth/google
```

**GET /api/auth/google/callback**

Google OAuth callback. Handled automatically by Google.

### 5. Get Current User

**GET /api/auth/me** 🔒

Get current user information (requires JWT token).

**Request:**
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success):**
```json
{
  "user": {
    "id": "64abc123def456789",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Response (Error):**
```json
{
  "error": "Access token required"
}
```

---

## Notes Routes 🔒
*All notes routes require JWT authentication*

### 1. Get All Notes

**GET /api/notes** 🔒

Get all notes for the authenticated user.

**Request:**
```http
GET http://localhost:5000/api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success):**
```json
{
  "notes": [
    {
      "_id": "64abc123def456789",
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64abc123def456790",
      "title": "Shopping List",
      "content": "- Milk\n- Bread\n- Eggs",
      "createdAt": "2024-01-14T15:20:00.000Z",
      "updatedAt": "2024-01-14T16:45:00.000Z"
    }
  ]
}
```

### 2. Create New Note

**POST /api/notes** 🔒

Create a new note.

**Request:**
```http
POST http://localhost:5000/api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the content of my new note. It can be quite long and contain multiple paragraphs.\n\nLike this one!"
}
```

**Response (Success):**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": "64abc123def456791",
    "title": "My New Note",
    "content": "This is the content of my new note. It can be quite long and contain multiple paragraphs.\n\nLike this one!",
    "createdAt": "2024-01-16T09:15:00.000Z",
    "updatedAt": "2024-01-16T09:15:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "Title and content are required"
}
```

### 3. Update Note

**PUT /api/notes/:id** 🔒

Update an existing note.

**Request:**
```http
PUT http://localhost:5000/api/notes/64abc123def456791
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My Updated Note Title",
  "content": "This is the updated content of my note."
}
```

**Response (Success):**
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": "64abc123def456791",
    "title": "My Updated Note Title",
    "content": "This is the updated content of my note.",
    "createdAt": "2024-01-16T09:15:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "Note not found"
}
```

### 4. Delete Note

**DELETE /api/notes/:id** 🔒

Delete a note.

**Request:**
```http
DELETE http://localhost:5000/api/notes/64abc123def456791
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success):**
```json
{
  "message": "Note deleted successfully"
}
```

**Response (Error):**
```json
{
  "error": "Note not found"
}
```

---

## Postman Testing Flow

### 1. Test Server Health
```http
GET http://localhost:5000/health
```

### 2. Create Account
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123456"
}
```

### 3. Verify Email (Check your email for OTP)
```http
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

### 4. Save the JWT Token
Copy the `token` from the response and use it in all subsequent requests.

### 5. Test Protected Route
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

### 6. Create a Note
```http
POST http://localhost:5000/api/notes
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "title": "Test Note",
  "content": "This is a test note created from Postman."
}
```

### 7. Get All Notes
```http
GET http://localhost:5000/api/notes
Authorization: Bearer <your_token_here>
```

### 8. Update a Note (use ID from previous response)
```http
PUT http://localhost:5000/api/notes/<note_id>
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "title": "Updated Test Note",
  "content": "This note has been updated."
}
```

### 9. Delete a Note
```http
DELETE http://localhost:5000/api/notes/<note_id>
Authorization: Bearer <your_token_here>
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation errors) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (token expired) |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 500 | Internal server error |

## Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Check `X-RateLimit-*` headers in response

## Data Validation

### Email Requirements
- Valid email format
- Must be unique

### Password Requirements
- Minimum 6 characters
- Required for email/password signup

### Note Requirements
- **Title:** Required, max 200 characters
- **Content:** Required, max 10,000 characters

### OTP Requirements
- 6-digit numeric code
- Expires in 10 minutes

---

## Environment Variables Required

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-taking
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

## Notes for Testing

1. **Email verification** requires a valid Gmail configuration in `.env`
2. **Google OAuth** works in browser only, not in Postman
3. **JWT tokens** expire in 24 hours
4. **Rate limiting** applies to all routes
5. **MongoDB** connection required for database operations
6. All **note operations** require authentication
7. Users can only access their own notes