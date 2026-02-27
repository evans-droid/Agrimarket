const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadLogo } = require('../config/cloudinary');
const {
  getCompanyInfo,
  updateCompanyInfo,
  uploadCompanyLogo,
  getContactInfo,
  updateContactInfo,
  getSocialLinks,
  updateSocialLinks,
  getSeoSettings,
  updateSeoSettings
} = require('../controllers/companyController');

// Public routes
router.get('/', getCompanyInfo);
router.get('/contact', getContactInfo);
router.get('/social', getSocialLinks);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

// Update company info
router.put('/', updateCompanyInfo);

// Upload logo
router.post('/logo', uploadLogo.single('logo'), uploadCompanyLogo);

// Update contact info
router.put('/contact', updateContactInfo);

// Update social links
router.put('/social', updateSocialLinks);

// SEO settings
router.get('/seo', getSeoSettings);
router.put('/seo', updateSeoSettings);

module.exports = router;