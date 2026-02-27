const { Payment, Order, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private
const initializePayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod, mobileMoneyProvider, mobileMoneyNumber } = req.body;

    // Get order
    const order = await Order.findByPk(orderId, {
      include: ['user', 'items']
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user_id !== req.user.id && req.user.role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN-${uuidv4()}-${Date.now()}`;

    // Create payment record
    const payment = await Payment.create({
      order_id: orderId,
      transaction_id: transactionId,
      amount: order.total_amount,
      payment_method: paymentMethod,
      mobile_money_provider: mobileMoneyProvider,
      mobile_money_number: mobileMoneyNumber,
      status: 'pending'
    });

    // If payment method is cash on delivery, mark as completed immediately
    if (paymentMethod === 'cash_on_delivery') {
      payment.status = 'completed';
      payment.payment_date = new Date();
      await payment.save();

      order.payment_status = 'completed';
      await order.save();

      // Send confirmation email
      await sendOrderConfirmationEmail(order.user.email, order);
    }

    res.json({
      success: true,
      message: 'Payment initialized successfully',
      payment: {
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.payment_method
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process mobile money payment
// @route   POST /api/payments/mobile-money
// @access  Private
const processMobileMoney = async (req, res, next) => {
  try {
    const { orderId, provider, phoneNumber } = req.body;

    const order = await Order.findByPk(orderId, {
      include: ['user']
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Mock mobile money payment processing
    // In production, integrate with actual Mobile Money API
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (!isSuccess) {
      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      order_id: orderId,
      transaction_id: `MM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: order.total_amount,
      payment_method: 'mobile_money',
      mobile_money_provider: provider,
      mobile_money_number: phoneNumber,
      status: 'completed',
      payment_date: new Date(),
      response_code: '00',
      response_message: 'Payment successful'
    });

    // Update order
    order.payment_status = 'completed';
    order.order_status = 'processing';
    await order.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(order.user.email, order);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        provider: payment.mobile_money_provider,
        date: payment.payment_date
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process cash on delivery
// @route   POST /api/payments/cash-on-delivery
// @access  Private
const processCashOnDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findByPk(orderId, {
      include: ['user']
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      order_id: orderId,
      transaction_id: `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: order.total_amount,
      payment_method: 'cash_on_delivery',
      status: 'pending',
      payment_date: null
    });

    // Update order
    order.payment_status = 'pending';
    order.order_status = 'processing';
    await order.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(order.user.email, order);

    res.json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      payment: {
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:transactionId
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      where: { transaction_id: req.params.transactionId },
      include: ['order']
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        method: payment.payment_method,
        date: payment.payment_date,
        order: {
          id: payment.order.id,
          number: payment.order.order_number,
          status: payment.order.order_status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
const getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      where: { order_id: req.params.orderId }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this order'
      });
    }

    res.json({
      success: true,
      status: payment.status,
      method: payment.payment_method,
      transactionId: payment.transaction_id,
      date: payment.payment_date
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      include: [{
        model: Order,
        as: 'order',
        where: { user_id: req.user.id },
        attributes: ['id', 'order_number', 'total_amount', 'created_at']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      payments: payments.map(p => ({
        id: p.id,
        transactionId: p.transaction_id,
        amount: p.amount,
        method: p.payment_method,
        status: p.status,
        date: p.payment_date || p.created_at,
        orderNumber: p.order.order_number
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:paymentId/refund
// @access  Private/Admin
const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.paymentId, {
      include: ['order']
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }

    // Mock refund process
    payment.status = 'refunded';
    payment.metadata = {
      ...payment.metadata,
      refunded_at: new Date(),
      refunded_by: req.user.id
    };
    await payment.save();

    // Update order
    await payment.order.update({
      payment_status: 'refunded',
      order_status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      payment: {
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        status: payment.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  getPaymentStatus,
  processMobileMoney,
  processCashOnDelivery,
  getPaymentHistory,
  refundPayment
};