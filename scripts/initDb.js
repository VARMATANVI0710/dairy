const mongoose = require('mongoose');
const User = require('../user');
const DairyEntry = require('../models/dairyEntry');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/loginSystem', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        return false;
    }
};

// Initialize database collections and indexes
const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database...');
        
        // Create collections if they don't exist
        await User.createCollection();
        await DairyEntry.createCollection();
        
        console.log('✅ Collections created successfully');
        
        // Create indexes
        await User.collection.createIndex({ username: 1 }, { unique: true });
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await DairyEntry.collection.createIndex({ author: 1, createdAt: -1 });
        await DairyEntry.collection.createIndex({ tags: 1 });
        
        console.log('✅ Indexes created successfully');
        
        // Check if admin user exists, if not create one
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            const admin = new User({
                username: 'admin',
                email: 'admin@example.com'
            });
            await User.register(admin, 'Admin123');
            console.log('✅ Admin user created successfully');
        } else {
            console.log('ℹ️ Admin user already exists');
        }
        
        console.log('🎉 Database initialization completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        return false;
    }
};

// Main function
const main = async () => {
    const connected = await connectDB();
    if (!connected) {
        console.log('💡 Please make sure MongoDB is running:');
        console.log('   - Start MongoDB service');
        console.log('   - Or run: mongod');
        process.exit(1);
    }
    
    const initialized = await initializeDatabase();
    if (initialized) {
        console.log('\n🚀 Your Personal Dairy system is ready!');
        console.log('📝 You can now:');
        console.log('   1. Start the application: npm start');
        console.log('   2. Create new users through the signup page');
        console.log('   3. Login and start writing dairy entries');
        console.log('   4. All data will be securely stored in MongoDB');
    }
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
};

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { connectDB, initializeDatabase };
