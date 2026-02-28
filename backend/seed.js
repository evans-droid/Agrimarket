const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const {
  User,
  Role,
  Category,
  Product,
  CompanySettings
} = require('./src/models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create roles
    const roles = await Role.bulkCreate([
      { name: 'admin' },
      { name: 'user' }
    ]);
    console.log('✅ Roles created');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@agrimarket.com',
      password: hashedPassword,
      phone: '+233501234567',
      role_id: 1,
      is_active: true
    });
    console.log('✅ Admin user created');

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Cereals', description: 'Fresh cereals including maize, rice, wheat, and more' },
      { name: 'Grains', description: 'Nutritious grains like millet, sorghum, and oats' },
      { name: 'Flour', description: 'Various types of flour including corn flour, wheat flour' },
      { name: 'Legumes', description: 'Protein-rich legumes like beans, groundnuts, and peas' },
      { name: 'Tubers', description: 'Fresh tubers including yam, cassava, and sweet potatoes' },
      { name: 'Vegetables', description: 'Fresh organic vegetables' }
    ]);
    console.log('✅ Categories created');

    // Create sample products
    const products = [
      {
        name: 'Organic Corn Dough',
        description: 'Freshly milled organic corn dough, perfect for banku and kenkey. Made from locally sourced maize.',
        price: 15.00,
        stock_quantity: 100,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1590779033100-94f60f7a7e97',
        is_active: true
      },
      {
        name: 'Premium White Maize',
        description: 'High-quality white maize, perfect for grinding or cooking. Non-GMO and locally grown.',
        price: 25.00,
        stock_quantity: 200,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076',
        is_active: true
      },
      {
        name: 'Brown Beans',
        description: 'Nutritious brown beans, rich in protein and fiber. Perfect for stews and soups.',
        price: 20.00,
        stock_quantity: 150,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1515543904379-3d757f8fe823',
        is_active: true
      },
      {
        name: 'Cassava Flour',
        description: 'Gluten-free cassava flour, perfect for baking and cooking. Made from fresh cassava.',
        price: 18.00,
        stock_quantity: 80,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
        is_active: true
      },
      {
        name: 'Groundnuts (Peanuts)',
        description: 'Roasted groundnuts, perfect for snacks or making groundnut paste. High in protein.',
        price: 12.00,
        stock_quantity: 300,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1547487430-d1e4b4a7f3c9',
        is_active: true
      },
      {
        name: 'Millet Grains',
        description: 'Traditional millet grains, rich in nutrients. Perfect for porridge and local dishes.',
        price: 22.00,
        stock_quantity: 120,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1614961233913-a5113a4a3ed8',
        is_active: true
      }
    ];

    await Product.bulkCreate(products);
    console.log('✅ Sample products created');

    // Create company settings
    await CompanySettings.create({
      company_name: 'AgriMarket',
      company_email: 'info@agrimarket.com',
      company_phone: '+233501234567',
      company_address: '123 Farm Road, Accra, Ghana',
      social_media: {
        facebook: 'https://facebook.com/agrimarket',
        twitter: 'https://twitter.com/agrimarket',
        instagram: 'https://instagram.com/agrimarket'
      },
      seo_settings: {
        title: 'AgriMarket - Fresh Agricultural Products Online',
        description: 'Buy fresh agricultural products directly from farmers. Best prices, quality guaranteed.',
        keywords: 'agriculture, farming, fresh produce, grains, cereals, flour, Ghana'
      }
    });
    console.log('✅ Company settings created');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('Email: admin@agrimarket.com');
    console.log('Password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
