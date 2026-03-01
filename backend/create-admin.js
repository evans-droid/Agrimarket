const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const { User, Role } = require('./src/models');

const createAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Models synced');

    // Check if roles exist
    let roles = await Role.findAll();
    if (roles.length === 0) {
      // Create roles if they don't exist
      roles = await Role.bulkCreate([
        { name: 'admin' },
        { name: 'user' }
      ]);
      console.log('✅ Roles created');
    }

    // Find admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      console.error('❌ Admin role not found');
      process.exit(1);
    }

    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@agrimarket.com' } });

    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role_id = adminRole.id;
      existingAdmin.is_active = true;
      await existingAdmin.save();
      console.log('✅ Existing user updated to admin');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@agrimarket.com',
        password: hashedPassword,
        phone: '+233501234567',
        role_id: adminRole.id,
        is_active: true
      });
      console.log('✅ Admin user created');
    }

    console.log('\n🎉 Admin user ready!');
    console.log('\n📝 Login credentials:');
    console.log('Email: admin@agrimarket.com');
    console.log('Password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
