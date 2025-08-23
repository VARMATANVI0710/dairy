# Environment Variables Setup Guide

## 🚀 Quick Setup

1. **Create a `.env` file** in your project root (same directory as `app.js`)
2. **Copy the variables below** into your `.env` file
3. **Customize the values** as needed

## 📝 Required Environment Variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/loginSystem

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (IMPORTANT: Change this!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Security
BCRYPT_ROUNDS=12
COOKIE_MAX_AGE=86400000
```

## 🔐 Security Notes

- **NEVER commit your `.env` file** to version control
- **Change the SESSION_SECRET** to a random string in production
- **Use strong, unique secrets** for production environments

## 🛠️ How to Create .env File

### Windows (Command Prompt)
```cmd
echo MONGODB_URI=mongodb://127.0.0.1:27017/loginSystem > .env
echo PORT=3000 >> .env
echo NODE_ENV=development >> .env
echo SESSION_SECRET=your-super-secret-session-key-change-this-in-production >> .env
```

### Windows (PowerShell)
```powershell
"MONGODB_URI=mongodb://127.0.0.1:27017/loginSystem" | Out-File -FilePath .env -Encoding UTF8
"PORT=3000" | Add-Content .env
"NODE_ENV=development" | Add-Content .env
"SESSION_SECRET=your-super-secret-session-key-change-this-in-production" | Add-Content .env
```

### macOS/Linux
```bash
cat > .env << EOF
MONGODB_URI=mongodb://127.0.0.1:27017/loginSystem
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
EOF
```

## ✅ Verification

After creating your `.env` file, restart your application:

```bash
npm start
```

You should see:
- 🚀 Server is running on port 3000
- 🌍 Environment: development
- 🗄️ Database: mongodb://127.0.0.1:27017/loginSystem

## 🔧 Customization Options

### Change Port
```bash
PORT=4000
```

### Change Database
```bash
MONGODB_URI=mongodb://localhost:27017/myPersonalDairy
```

### Production Environment
```bash
NODE_ENV=production
SESSION_SECRET=your-very-long-random-production-secret-key
```

## 🚨 Troubleshooting

- **File not found**: Make sure `.env` is in the same directory as `app.js`
- **Permission denied**: Check file permissions
- **Variables not loading**: Restart your application after creating `.env`
