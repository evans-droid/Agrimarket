const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  initializePayment,
  verifyPayment,
  getPaymentStatus,
  processMobileMoney,
  processCashOnDelivery,
  getPaymentHistory,
  refundPayment
} = require('../controllers/paymentController');

// All payment routes require authentication
router.use(protect);

// Initialize payment
router.post('/initialize', initializePayment);

// Verify payment
router.get('/verify/:transactionId', verifyPayment);

// Get payment status
router.get('/status/:orderId', getPaymentStatus);

// Process mobile money payment
router.post('/mobile-money', processMobileMoney);

// Process cash on delivery
router.post('/cash-on-delivery', processCashOnDelivery);

// Get payment history
router.get('/history', getPaymentHistory);

// Refund payment (Admin only)
router.post('/:paymentId/refund', authorize('admin'), refundPayment);

module.exports = router;
