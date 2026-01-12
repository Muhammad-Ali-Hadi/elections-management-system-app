require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Voter = require('./models/Voter');
const Admin = require('./models/Admin');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');
const ElectionCommiteeMember = require('./models/ElectionCommiteeMember');

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('Connection URI:', process.env.MONGODB_URI);

    // Connect to MongoDB with explicit options
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elections_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✓ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);

    // Clear existing data
    console.log('\n🗑️  Clearing existing collections...');
    await Voter.deleteMany({});
    await Admin.deleteMany({});
    await Election.deleteMany({});
    await Candidate.deleteMany({});
    await ElectionCommiteeMember.deleteMany({});

    console.log('✓ Cleared existing data');

    // Create Admin User
    console.log('\n👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin@12345', 10);
    const admin = new Admin({
      username: 'admin',
      password: adminPassword,
      email: 'admin@allahnnoor.com',
      name: 'Admin User',
      role: 'admin',
      permissions: ['manage_election', 'manage_voters', 'view_results']
    });
    await admin.save();
    console.log('✓ Admin created');
    console.log('  Username: admin');
    console.log('  Password: admin@12345');

    // Create Voters for all flats
    console.log('\n👥 Creating voters...');
    const voters = [];
    const basePassword = 'password@123';
    const hashedPassword = await bcrypt.hash(basePassword, 10);

    // Wing A: A-1 to A-45
    for (let i = 1; i <= 45; i++) {
      const flatNumber = `A-${i}`;
      voters.push({
        flatNumber,
        name: `Resident ${flatNumber}`,
        password: hashedPassword,
        wing: 'A',
        floorNumber: Math.ceil(i / 3),
        email: `resident${i}@allahnnoor.com`,
        phone: `+91-900-${String(1000000 + i).slice(-6)}`,
        role: 'voter'
      });
    }

    // Wing B: B-1 to B-60
    for (let i = 1; i <= 60; i++) {
      const flatNumber = `B-${i}`;
      voters.push({
        flatNumber,
        name: `Resident ${flatNumber}`,
        password: hashedPassword,
        wing: 'B',
        floorNumber: Math.ceil(i / 4),
        email: `resident-b${i}@allahnnoor.com`,
        phone: `+91-901-${String(1000000 + i).slice(-6)}`,
        role: 'voter'
      });
    }

    const savedVoters = await Voter.insertMany(voters);
    console.log(`✓ Created ${savedVoters.length} voters`);
    console.log(`  Wing A: A-1 to A-45 (45 voters)`);
    console.log(`  Wing B: B-1 to B-60 (60 voters)`);
    console.log(`  Password: ${basePassword}`);

    // Create Election
    console.log('\n📋 Creating election...');
    const election = new Election({
      name: '2026 Annual Elections - Allah Noor',
      description: 'Annual elections for the election of new committee members',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      isOpen: true,
      societyName: 'Allah Noor',
      positions: ['President', 'Vice President', 'General Secretary', 'Joint Secretary', 'Finance Secretary'],
      totalFlats: {
        wingA: 45,
        wingB: 60
      }
    });
    const savedElection = await election.save();
    console.log(`✓ Election created`);
    console.log(`  Name: ${savedElection.name}`);
    console.log(`  ID: ${savedElection._id}`);

    // Create Sample Candidates
    console.log('\n🎤 Creating candidates...');
    const candidates = [
      {
        name: 'Ahmed Hassan',
        position: 'President',
        flatNumber: 'A-5',
        wing: 'A',
        description: 'Experienced community leader',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Fatima Khan',
        position: 'President',
        flatNumber: 'B-20',
        wing: 'B',
        description: 'Dedicated to community development',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Mohammed Ali',
        position: 'Vice President',
        flatNumber: 'A-12',
        wing: 'A',
        description: 'Strong management skills',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Aisha Malik',
        position: 'Vice President',
        flatNumber: 'B-35',
        wing: 'B',
        description: 'Community organizer',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Ibrahim Said',
        position: 'General Secretary',
        flatNumber: 'A-18',
        wing: 'A',
        description: 'Excellent record keeper',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Zainab Ahmed',
        position: 'General Secretary',
        flatNumber: 'B-42',
        wing: 'B',
        description: 'Detail-oriented professional',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Yusuf Khan',
        position: 'Joint Secretary',
        flatNumber: 'A-22',
        wing: 'A',
        description: 'Team coordination expert',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Sara Patel',
        position: 'Joint Secretary',
        flatNumber: 'B-48',
        wing: 'B',
        description: 'Event management specialist',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Omar Hassan',
        position: 'Finance Secretary',
        flatNumber: 'A-25',
        wing: 'A',
        description: 'Financial management expertise',
        electionId: election._id,
        votes: 0
      },
      {
        name: 'Noor Ibrahim',
        position: 'Finance Secretary',
        flatNumber: 'B-55',
        wing: 'B',
        description: 'Accounting background',
        electionId: election._id,
        votes: 0
      }
    ];

    const savedCandidates = await Candidate.insertMany(candidates);
    console.log(`✓ Created ${savedCandidates.length} candidates`);
    candidates.forEach(c => {
      console.log(`  - ${c.name} (${c.position})`);
    });

    // Create Election Committee Members
    console.log('\n🏛️  Creating committee members...');
    const committeeMembers = [
      {
        name: 'Mr. Raj Patel',
        position: 'Chief',
        flatNumber: 'A-1',
        wing: 'A',
        email: 'chief@allahnnoor.com',
        phone: '+91-98765-43210',
        responsibilities: 'Overall supervision of elections',
        electionId: election._id
      },
      {
        name: 'Mrs. Priya Sharma',
        position: 'Co-Chief',
        flatNumber: 'B-1',
        wing: 'B',
        email: 'cochief@allahnnoor.com',
        phone: '+91-98765-43211',
        responsibilities: 'Assist chief, manage voter coordination',
        electionId: election._id
      },
      {
        name: 'Mr. Vikram Singh',
        position: 'Member',
        flatNumber: 'A-10',
        wing: 'A',
        email: 'member1@allahnnoor.com',
        phone: '+91-98765-43212',
        responsibilities: 'Manage voting booths',
        electionId: election._id
      },
      {
        name: 'Ms. Deepa Nair',
        position: 'Member',
        flatNumber: 'B-30',
        wing: 'B',
        email: 'member2@allahnnoor.com',
        phone: '+91-98765-43213',
        responsibilities: 'Verify voter eligibility',
        electionId: election._id
      },
      {
        name: 'Mr. Arjun Das',
        position: 'Member',
        flatNumber: 'A-35',
        wing: 'A',
        email: 'member3@allahnnoor.com',
        phone: '+91-98765-43214',
        responsibilities: 'Handle complaints',
        electionId: election._id
      },
      {
        name: 'Mrs. Sneha Gupta',
        position: 'Member',
        flatNumber: 'B-50',
        wing: 'B',
        email: 'member4@allahnnoor.com',
        phone: '+91-98765-43215',
        responsibilities: 'Count and verify votes',
        electionId: election._id
      }
    ];

    // Verify collections
    console.log('\n📊 Collections created in database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`  ✓ ${col.name}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(70));

    console.log('\n📋 SUMMARY:');
    console.log(`   Voters: ${savedVoters.length}`);
    console.log(`   Admin: 1`);
    console.log(`   Elections: 1`);
    console.log(`   Candidates: ${savedCandidates.length}`);
    console.log(`   Committee Members: 6`);

    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('─'.repeat(70));
    console.log('ADMIN:');
    console.log('  Username: admin');
    console.log('  Password: admin@12345');
    console.log('\nVOTERS:');
    console.log('  Flat Numbers: A-1 to A-45, B-1 to B-60');
    console.log('  Password: password@123');
    console.log('─'.repeat(70));

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Ready to use! You can now:');
    console.log('  1. Start the backend: npm run dev');
    console.log('  2. Start the frontend: npm run dev (in elections folder)');
    console.log('  3. Login and test the voting system');
    console.log('='.repeat(70) + '\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR DURING SEEDING:');
    console.error('─'.repeat(70));
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('─'.repeat(70));
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  CONNECTION FAILED');
      console.error('   Make sure MongoDB is running!');
      console.error('   Check your connection string in .env file');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  AUTHENTICATION FAILED');
      console.error('   Check your MongoDB username and password');
    }

    console.error('\nFull Error:');
    console.error(error);
    
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
