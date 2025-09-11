import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/the4g');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

const dropUsernameIndexIfExists = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    const indexes = await collection.indexes();
    const usernameIndex = indexes.find(idx => idx.name === 'username_1' || (idx.key && idx.key.username));
    if (usernameIndex) {
      console.log('🧹 Dropping legacy username index...');
      try {
        await collection.dropIndex('username_1');
        console.log('✅ Dropped username_1 index');
      } catch (err) {
        if (err.code === 27) {
          console.log('ℹ️ username_1 index not found (already removed)');
        } else {
          console.log('⚠️ Could not drop username_1 by name, trying by key...');
          try {
            await collection.dropIndex({ username: 1 });
            console.log('✅ Dropped { username: 1 } index');
          } catch (e2) {
            console.warn('⚠️ Failed to drop username index:', e2.message);
          }
        }
      }
    } else {
      console.log('ℹ️ No legacy username index found');
    }
  } catch (e) {
    console.warn('⚠️ Index check/drop failed:', e.message);
  }
}

const createSuperAdmin = async () => {
  try {
    await connectToDb();
    await dropUsernameIndexIfExists();
    
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists:', existingSuperAdmin.email);
      console.log('👑 Role:', existingSuperAdmin.role);
      return;
    }
    
    // Create super admin user
    const superAdminData = {
      fullName: 'Super Administrator',
      email: 'superadmin@api.com',
      password: 'SuperAdmin123!',
      role: 'SUPER_ADMIN',
      adminPermissions: [
        'CREATE_ADMIN',
        'DELETE_ADMIN', 
        'MANAGE_USERS',
        'MANAGE_COURSES',
        'MANAGE_PAYMENTS',
        'VIEW_ANALYTICS'
      ],
      isActive: true
    };

    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔐 Password:', superAdminData.password);
    console.log('👑 Role:', superAdmin.role);
    console.log('🔑 Permissions:', superAdmin.adminPermissions);
    console.log('\n💡 You can now login with these credentials');
    console.log('🌐 Go to: http://localhost:5173/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
