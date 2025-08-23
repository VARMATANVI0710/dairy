# Personal Dairy System

A secure, private dairy application with user authentication and data encryption.

## Features

- 🔐 **Secure Authentication**: Passport.js with local strategy
- 🔒 **Data Privacy**: Each user can only see their own dairy entries
- ✍️ **Rich Dairy Entries**: Title, content, mood, weather, tags, and privacy settings
- ✅ **Input Validation**: Joi validation for all forms
- 🎨 **Modern UI**: Bootstrap 5 with responsive design
- 📱 **Mobile Friendly**: Responsive design for all devices

## Database Schema

### User Model
- Username (unique)
- Email (unique)
- Password (hashed with bcrypt)
- Profile information
- Array of dairy entry references

### Dairy Entry Model
- Title (required, max 100 chars)
- Content (required, max 5000 chars)
- Mood (enum: Happy, Sad, Excited, Calm, Anxious, Grateful, Other)
- Weather (optional, max 50 chars)
- Tags (array of strings, max 20 chars each)
- Privacy setting (private/public)
- Author reference (User ID)
- Timestamps (created, updated)

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Express-session with secure cookies
- **Input Validation**: Joi schemas for all user inputs
- **Authorization**: Users can only access their own data
- **SQL Injection Protection**: Mongoose ODM
- **XSS Protection**: Input sanitization and output encoding

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd login
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/loginSystem
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your personal dairy dashboard
3. **Write Entries**: Create new dairy entries with rich metadata
4. **Manage Entries**: View, edit, and delete your entries
5. **Organize**: Use tags and mood tracking for better organization

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

### Dairy Entries
- `GET /dairy` - List all user's entries
- `GET /dairy/new` - Show new entry form
- `POST /dairy` - Create new entry
- `GET /dairy/:id` - View specific entry
- `GET /dairy/:id/edit` - Show edit form
- `PUT /dairy/:id` - Update entry
- `DELETE /dairy/:id` - Delete entry

## Validation Rules

### Signup
- Username: 3-30 alphanumeric characters
- Email: Valid email format
- Password: Minimum 6 characters, must contain uppercase, lowercase, and number

### Dairy Entry
- Title: 1-100 characters
- Content: 1-5000 characters
- Mood: Must be from predefined list
- Weather: Optional, max 50 characters
- Tags: Optional, comma-separated, max 200 characters total

## File Structure

```
login/
├── models/
│   └── dairyEntry.js      # Dairy entry schema
├── routes/
│   └── dairy.js           # Dairy CRUD routes
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── validation.js      # Joi validation middleware
├── views/
│   ├── partials/
│   │   ├── header.ejs     # Navigation and header
│   │   └── footer.ejs     # Footer and scripts
│   ├── dairy/
│   │   ├── index.ejs      # List all entries
│   │   ├── new.ejs        # Create new entry
│   │   ├── show.ejs       # View single entry
│   │   └── edit.ejs       # Edit entry
│   ├── dashboard.ejs      # User dashboard
│   ├── login.ejs          # Login form
│   └── signup.ejs         # Registration form
├── app.js                 # Main application file
├── user.js               # User model
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, bcrypt
- **Validation**: Joi
- **Frontend**: EJS templates, Bootstrap 5
- **Icons**: Font Awesome
- **Session**: Express-session

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
