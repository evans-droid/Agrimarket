const User = require('./user');
const Role = require('./role');
const Product = require('./products');
const Category = require('./category');
const Cart = require('./cart');
const Order = require('./order');
const OrderItem = require('./orderItem');
const CompanySettings = require('./companySettings');
const Payment = require('./payment');
const Review = require('./review');
const Wishlist = require('./wishlist');

// Define associations
const initializeModels = () => {
  // User - Role associations
  User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
  Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

  // Product - Category associations
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

  // Product - User associations (seller)
  Product.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
  User.hasMany(Product, { foreignKey: 'seller_id', as: 'products' });

  // Cart associations
  Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Cart, { foreignKey: 'user_id', as: 'cartItems' });
  
  Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Product.hasMany(Cart, { foreignKey: 'product_id', as: 'cartItems' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

  OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });

  // Payment associations
  Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

  Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });

  // Wishlist associations
  Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist' });

  Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlistedBy' });

  console.log('✅ Model associations initialized');
};

module.exports = {
  User,
  Role,
  Product,
  Category,
  Cart,
  Order,
  OrderItem,
  CompanySettings,
  Payment,
  Review,
  Wishlist,
  initializeModels
};