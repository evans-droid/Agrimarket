const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  getCategoryProducts
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/:id/products', getCategoryProducts);

module.exports = router;