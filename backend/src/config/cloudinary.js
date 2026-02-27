const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agricultural-marketplace/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Configure storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agricultural-marketplace/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'limit' }
    ]
  }
});

// Configure storage for company logo
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agricultural-marketplace/company',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
    transformation: [
      { width: 200, height: 200, crop: 'limit' }
    ]
  }
});

// Configure storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agricultural-marketplace/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 200, height: 200, crop: 'thumb', gravity: 'face' }
    ]
  }
});

// Create multer upload instances
const uploadProduct = multer({ 
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadCategory = multer({ 
  storage: categoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const uploadLogo = multer({ 
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Upload to Cloudinary function
const uploadToCloudinary = async (filePath, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `agricultural-marketplace/${folder}`,
      use_filename: true,
      unique_filename: true
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: 'auto',
    quality: 'auto',
    ...options
  });
};

module.exports = {
  cloudinary,
  uploadProduct,
  uploadCategory,
  uploadLogo,
  uploadAvatar,
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl
};