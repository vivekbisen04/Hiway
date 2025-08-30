# Note-Taking Application

A full-stack note-taking application built with React TypeScript frontend and Node.js Express backend, featuring secure authentication and responsive design.

## Features

### Authentication System
- **Email + OTP Verification**: Secure account creation with email verification
- **Google OAuth Integration**: One-click sign up and login with Google
- **JWT Token Authentication**: Secure API access with 24-hour token expiration
- **Input Validation**: Email format and password strength validation
- **Error Handling**: Comprehensive error handling for auth failures

### Notes Management
- **Create Notes**: Add new notes with title and content
- **View Notes**: Responsive grid layout for all notes
- **Edit Notes**: Modify existing notes in a modal interface  
- **Delete Notes**: Remove notes with confirmation
- **Real-time Updates**: Automatic refresh after CRUD operations

### User Interface
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI**: Clean, professional interface
- **Loading States**: Visual feedback during API operations
- **Error Messages**: Clear error communication to users

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** as build tool and dev server
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication tokens
- **bcryptjs** for password hashing
- **Passport.js** with Google OAuth 2.0
- **Nodemailer** for email sending
- **Express Rate Limit** for API protection

## Project Structure

```
note-taking/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account (for email sending)
- Google Cloud Project (for OAuth)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd note-taking

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Configuration

Create environment file:
```bash
cd backend
cp .env.example .env
```

Configure the `.env` file with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-taking
JWT_SECRET=your_super_secure_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env` file

### 4. Email Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use your Gmail address and the generated app password in `.env`

### 5. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally  
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
```bash
# Create free cluster at https://cloud.mongodb.com/
# Get connection string and update MONGODB_URI in .env
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Create account with email/password
- `POST /api/auth/verify-otp` - Verify email with OTP code
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user info (requires JWT)

### Notes Routes (Protected)
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required if no googleId),
  googleId: String (unique, sparse),
  isVerified: Boolean (default: false),
  createdAt: Date (default: now)
}
```

### Note Model
```javascript
{
  title: String (required, max: 200),
  content: String (required, max: 10000),
  userId: ObjectId (required, ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model (Temporary)
```javascript
{
  email: String (required),
  otp: String (required),
  expiresAt: Date (default: 10 minutes from now)
}
```

## Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Expiration**: 24-hour token lifecycle
- **Rate Limiting**: 100 requests per 15-minute window
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend origin only
- **MongoDB Injection Protection**: Mongoose query validation

## Development Guidelines

- **TypeScript**: Full type coverage on both frontend and backend
- **Error Handling**: Comprehensive error boundaries and try-catch blocks
- **Loading States**: User feedback during async operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Organization**: Feature-based folder structure
- **Security First**: Never expose sensitive information in client code

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
# Configure environment variables in platform dashboard
# Deploy using platform-specific instructions
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check MONGODB_URI format
   - Ensure network access for Atlas

2. **Google OAuth Not Working**
   - Verify Client ID and Secret
   - Check authorized redirect URIs
   - Ensure Google+ API is enabled

3. **Email Not Sending**
   - Confirm Gmail app password (not account password)
   - Check 2-factor authentication is enabled
   - Verify EMAIL_USER and EMAIL_PASS values

4. **CORS Issues**
   - Ensure backend FRONTEND_URL matches frontend URL
   - Check browser network tab for preflight requests

### Development Tips

- Use browser DevTools Network tab to debug API calls
- Check backend console logs for server-side errors
- Verify JWT tokens in localStorage using DevTools
- Test with different email providers for signup
- Use MongoDB Compass to inspect database collections

## Features Implemented

✅ Email + OTP verification signup flow  
✅ Google OAuth integration  
✅ JWT token authentication  
✅ Password strength validation  
✅ Notes CRUD operations  
✅ Responsive design  
✅ Loading and error states  
✅ Protected routes  
✅ Rate limiting  
✅ Input validation  
✅ Email sending  
✅ Database indexing  
✅ Security best practices  

## License

MIT License - see LICENSE file for details