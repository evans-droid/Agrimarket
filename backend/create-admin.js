const { sequelize } = require('./src/config/database');
const { User, Role, Category, Product, CompanySettings } = require('./src/models');

const createAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Force sync - drops all tables and recreates them
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (fresh)');

    // Create roles
    await Role.bulkCreate([
      { name: 'admin' },
      { name: 'user' }
    ]);
    console.log('✅ Roles created');

    // Get admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    // Create admin user - NOTE: Password will be hashed by the model's beforeCreate hook
    await User.create({
      name: 'Admin User',
      email: 'admin@agrimarket.com',
      password: 'Admin@123',  // Plain password - will be hashed by hook
      phone: '+233501234567',
      role_id: adminRole.id,
      is_active: true
    });
    console.log('✅ Admin user created');

    // Create categories
    await Category.bulkCreate([
      { name: 'Cereals', description: 'Fresh cereals including maize, rice, wheat, and more' },
      { name: 'Grains', description: 'Nutritious grains like millet, sorghum, and oats' },
      { name: 'Flour', description: 'Various types of flour including corn flour, wheat flour' },
      { name: 'Legumes', description: 'Protein-rich legumes like beans, groundnuts, and peas' },
      { name: 'Tubers', description: 'Fresh tubers including yam, cassava, and sweet potatoes' },
      { name: 'Vegetables', description: 'Fresh organic vegetables' }
    ]);
    console.log('✅ Categories created');

    // Create company settings
    await CompanySettings.create({
      company_name: 'AgriMarket',
      company_email: 'info@agrimarket.com',
      company_phone: '+233501234567',
      company_address: '123 Farm Road, Accra, Ghana'
    });
    console.log('✅ Company settings created');

    // Verify admin user was created
    const adminUser = await User.findOne({ where: { email: 'admin@agrimarket.com' } });
    if (adminUser) {
      console.log('\n✅ Admin user verified in database!');
      console.log('   ID:', adminUser.id);
      console.log('   Name:', adminUser.name);
      console.log('   Email:', adminUser.email);
      console.log('   Role ID:', adminUser.role_id);
      console.log('   Active:', adminUser.is_active);
      console.log('   Password (hashed):', adminUser.password.substring(0, 20) + '...');
    }

    console.log('\n🎉 Database initialized successfully!');
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
