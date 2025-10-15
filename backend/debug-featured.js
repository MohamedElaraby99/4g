import mongoose from 'mongoose';
import User from './models/user.model.js';
import InstructorProfile from './models/instructor.model.js';

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/the4g';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const debugFeaturedInstructors = async () => {
  try {
    console.log('🔍 Debugging featured instructors query...');

    // Test different query approaches
    console.log('\n1. Testing direct query for instructors with featured profile:');
    const directQuery = await User.find({
        role: 'INSTRUCTOR',
        isActive: true,
        'instructorProfile.featured': true
    }).populate('instructorProfile');

    console.log(`Found ${directQuery.length} instructors`);

    console.log('\n2. Testing instructors with featured field directly:');
    const featuredFieldQuery = await User.find({
        role: 'INSTRUCTOR',
        isActive: true,
        featured: true
    });

    console.log(`Found ${featuredFieldQuery.length} instructors`);

    console.log('\n3. Testing OR query (as used in the controller):');
    const orQuery = await User.find({
        role: 'INSTRUCTOR',
        isActive: true,
        $or: [
            { 'instructorProfile.featured': true },
            { featured: true }
        ]
    }).populate('instructorProfile');

    console.log(`Found ${orQuery.length} instructors`);

    // Check all instructors and their profiles
    console.log('\n4. Checking all instructors and their profile featured status:');
    const allInstructors = await User.find({ role: 'INSTRUCTOR' }).populate('instructorProfile');

    allInstructors.forEach((instructor, index) => {
        console.log(`Instructor ${index + 1}: ${instructor.fullName}`);
        console.log(`  - Profile exists: ${!!instructor.instructorProfile}`);
        console.log(`  - Profile featured: ${instructor.instructorProfile?.featured || false}`);
        console.log(`  - User featured: ${instructor.featured || false}`);
    });

  } catch (error) {
    console.error('❌ Error debugging:', error);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('🚀 Starting debug script...');
    await connectDB();
    await debugFeaturedInstructors();
    console.log('🎉 Debug script completed!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
};

main();
