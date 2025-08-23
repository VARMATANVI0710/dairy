const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');

mongoose.connect('mongodb://127.0.0.1:27017/loginSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // List all collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        if (err) {
            console.log('❌ Error listing collections:', err);
        } else {
            console.log('📚 Collections in database:');
            if (collections.length === 0) {
                console.log('   (No collections yet)');
            } else {
                collections.forEach(collection => {
                    console.log(`   - ${collection.name}`);
                });
            }
        }
        
        mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB is installed');
    console.log('   2. Start MongoDB service: mongod');
    console.log('   3. Check if MongoDB is running on port 27017');
    console.log('   4. Verify MongoDB installation: mongod --version');
    process.exit(1);
});
