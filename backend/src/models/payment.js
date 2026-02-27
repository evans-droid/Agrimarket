const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('mobile_money', 'cash_on_delivery', 'card'),
    allowNull: false
  },
  mobile_money_provider: {
    type: DataTypes.ENUM('mtn', 'vodafone', 'airteltigo')
  },
  mobile_money_number: {
    type: DataTypes.STRING(20)
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_date: {
    type: DataTypes.DATE
  },
  response_code: {
    type: DataTypes.STRING(50)
  },
  response_message: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;