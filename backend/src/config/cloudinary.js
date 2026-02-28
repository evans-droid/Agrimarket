const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Try to import CloudinaryStorage, handle different versions
let CloudinaryStorage;
try {
  const multerStorageCloudinary = require('multer-storage-cloudinary');
  CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage;
} catch (err) {
  console.warn('multer-storage-cloudinary not available, using local storage fallback');
  CloudinaryStorage = null;
}

// Helper function to ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Base upload directory
const uploadDir = path.join(__dirname, '../../uploads');
ensureDir(uploadDir);
ensureDir(path.join(uploadDir, 'products'));
ensureDir(path.join(uploadDir, 'categories'));
ensureDir(path.join(uploadDir, 'company'));
ensureDir(path.join(uploadDir, 'avatars'));

// Configure storage for product images
let productStorage;
if (CloudinaryStorage) {
  productStorage = new CloudinaryStorage({
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
} else {
  // Fallback to local storage
  productStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(uploadDir, 'products')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
}

// Configure storage for category images
let categoryStorage;
if (CloudinaryStorage) {
  categoryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'agricultural-marketplace/categories',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 400, height: 400, crop: 'limit' }
      ]
    }
  });
} else {
  categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(uploadDir, 'categories')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
}

// Configure storage for company logo
let logoStorage;
if (CloudinaryStorage) {
  logoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'agricultural-marketplace/company',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
      transformation: [
        { width: 200, height: 200, crop: 'limit' }
      ]
    }
  });
} else {
  logoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(uploadDir, 'company')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
}

// Configure storage for user avatars
let avatarStorage;
if (CloudinaryStorage) {
  avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'agricultural-marketplace/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [
        { width: 200, height: 200, crop: 'thumb', gravity: 'face' }
      ]
    }
  });
} else {
  avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(uploadDir, 'avatars')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
}

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
