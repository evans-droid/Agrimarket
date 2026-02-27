const { User, Order } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] },
      include: [{
        model: Order,
        as: 'orders',
        limit: 5,
        order: [['created_at', 'DESC']]
      }]
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, delivery_address } = req.body;

    const user = await User.findByPk(req.user.id);
    
    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      delivery_address: delivery_address || user.delivery_address
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        delivery_address: user.delivery_address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery address
// @route   PUT /api/users/address
// @access  Private
const updateDeliveryAddress = async (req, res, next) => {
  try {
    const { delivery_address } = req.body;

    const user = await User.findByPk(req.user.id);
    
    await user.update({ delivery_address });

    res.json({
      success: true,
      message: 'Delivery address updated successfully',
      delivery_address: user.delivery_address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Soft delete - deactivate account
    await user.update({ is_active: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: ['items'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  updateDeliveryAddress,
  deleteAccount,
  getUserOrders
};