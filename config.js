// Personal Dairy System Configuration
require('dotenv').config();

module.exports = {
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loginSystem'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    
    // Session Configuration
    session: {
        secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
        cookie: {
            maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 hours
        }
    },
    
    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
    },
    
    // Email Configuration (for future use)
    email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
