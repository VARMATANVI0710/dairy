# 🚀 Personal Dairy System - Setup Guide

This guide will help you set up the Personal Dairy system with MongoDB database.

## 📋 Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (version 4.4 or higher)
- **npm** (comes with Node.js)

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Verify MongoDB Installation
```bash
# Check MongoDB version
mongod --version

# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"
# or
mongosh --eval "db.runCommand('ping')"
```

### 4. Test Database Connection
```bash
npm run test-db
```

Expected output:
```
🔍 Testing MongoDB connection...
✅ MongoDB connection successful!
📊 Database: loginSystem
🌐 Host: localhost
🔌 Port: 27017
📚 Collections in database:
   (No collections yet)
👋 Disconnected from MongoDB
```

### 5. Initialize Database
```bash
npm run init-db
```

Expected output:
```
✅ Connected to MongoDB successfully
🔄 Initializing database...
✅ Collections created successfully
✅ Indexes created successfully
✅ Admin user created successfully
🎉 Database initialization completed successfully!

🚀 Your Personal Dairy system is ready!
📝 You can now:
   1. Start the application: npm start
   2. Create new users through the signup page
   3. Login and start writing dairy entries
   4. All data will be securely stored in MongoDB
👋 Disconnected from MongoDB
```

### 6. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Or use the setup command to initialize DB and start
npm run setup
```

## 🌐 Access the Application

Once started, open your browser and go to:
- **Main URL**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Signup Page**: http://localhost:3000/signup

## 👤 Default Admin Account

After running `npm run init-db`, you'll have a default admin account:
- **Username**: admin
- **Password**: Admin123

## 📊 Database Structure

The system creates the following collections in MongoDB:

### Users Collection
- Stores user accounts with encrypted passwords
- Each user has a unique username and email
- Passwords are hashed using bcrypt

### Dairy Entries Collection
- Stores all dairy entries
- Each entry is linked to its author (user)
- Includes metadata like mood, weather, tags, and timestamps

## 🔒 Security Features

- **Password Hashing**: All passwords are encrypted using bcrypt
- **Session Management**: Secure session handling with express-session
- **Input Validation**: Joi validation for all user inputs
- **Authorization**: Users can only access their own data
- **Data Privacy**: Each user's dairy entries are completely private

## 🐛 Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Check MongoDB status**:
   ```bash
   # Windows
   net start | findstr MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

3. **Verify MongoDB port**:
   ```bash
   netstat -an | grep 27017
   ```

### Common Error Messages

- **"ECONNREFUSED"**: MongoDB is not running
- **"Authentication failed"**: Check MongoDB user credentials
- **"Database not found"**: Run `npm run init-db` to create the database

### Reset Database

If you need to start fresh:
```bash
# Connect to MongoDB
mongosh

# Switch to database
use loginSystem

# Drop all collections
db.dropDatabase()

# Exit MongoDB shell
exit

# Reinitialize database
npm run init-db
```

## 📝 Next Steps

1. **Create your first account**: Go to the signup page
2. **Write your first dairy entry**: After logging in, click "New Entry"
3. **Explore features**: Try editing, deleting, and organizing entries with tags
4. **Customize**: Modify the UI or add new features as needed

## 🆘 Need Help?

- Check the console output for error messages
- Verify MongoDB is running and accessible
- Ensure all dependencies are installed
- Check the README.md for more information

## 🎯 Success Indicators

Your system is working correctly when:
- ✅ MongoDB connection is successful
- ✅ Database initialization completes without errors
- ✅ Application starts on port 3000
- ✅ You can create new user accounts
- ✅ You can login and access the dashboard
- ✅ You can create, edit, and delete dairy entries
- ✅ All data persists between application restarts

---

**Happy Writing! 📖✨**
