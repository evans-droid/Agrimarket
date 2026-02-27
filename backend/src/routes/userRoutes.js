const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateDeliveryAddress,
  deleteAccount
} = require('../controllers/userController');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/address', updateDeliveryAddress);
router.delete('/account', deleteAccount);

module.exports = router;