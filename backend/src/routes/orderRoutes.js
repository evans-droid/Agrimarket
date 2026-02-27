const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');

router.use(protect);

router.get('/', getUserOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);

module.exports = router;
