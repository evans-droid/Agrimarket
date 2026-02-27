const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanySettings = sequelize.define('CompanySettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'AgriMarket'
  },
  company_logo: {
    type: DataTypes.STRING(500)
  },
  company_email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  company_phone: {
    type: DataTypes.STRING(20)
  },
  company_address: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'company_settings',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false
});

module.exports = CompanySettings;