require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Connection...\n');
    console.log('Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/elections_db');
    
    const connection = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/elections_db',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      }
    );

    console.log('✅ Connection Successful!\n');
    console.log('📊 Connection Details:');
    console.log('  Host:', mongoose.connection.host);
    console.log('  Port:', mongoose.connection.port);
    console.log('  Database:', mongoose.connection.name);
    console.log('  Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');

    // List databases
    console.log('\n📂 Available Databases:');
    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });

    // List collections in current database
    console.log('\n📋 Collections in "' + mongoose.connection.name + '":');
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('  (none - database is empty)');
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }

    console.log('\n✅ MongoDB connection is working correctly!');
    console.log('💡 Next: Run "npm run seed" to populate the database\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB is not running!');
      console.error('Steps to fix:');
      console.error('  1. Make sure MongoDB server is running');
      console.error('  2. Check if port 27017 is accessible');
      console.error('  3. Verify the connection string in .env file');
    }

    if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  Authentication failed!');
      console.error('Check your MongoDB username and password in .env');
    }

    if (error.code === 'ETIMEDOUT') {
      console.error('\n⚠️  Connection timed out!');
      console.error('MongoDB might not be running or is not accessible');
    }

    console.error('\nFull Error:', error);
    process.exit(1);
  }
};

testConnection();
