const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  },
  // Disable foreign key constraints for SQLite
  foreignKeyConstraints: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database connected successfully');
    
    // Disable foreign key constraints for this connection
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Test connection
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('📊 Database query test:', results[0].result === 2 ? 'passed' : 'failed');
    
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
