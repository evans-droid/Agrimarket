const { CompanySettings } = require('../models');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get company information
// @route   GET /api/company
// @access  Public
const getCompanyInfo = async (req, res, next) => {
  try {
    let company = await CompanySettings.findOne();

    if (!company) {
      // Create default company settings if none exists
      company = await CompanySettings.create({
        company_name: 'AgriMarket',
        company_email: 'info@agrimarket.com',
        company_phone: '+233 XX XXX XXXX',
        company_address: 'Accra, Ghana'
      });
    }

    res.json({
      success: true,
      company: {
        id: company.id,
        name: company.company_name,
        logo: company.company_logo,
        email: company.company_email,
        phone: company.company_phone,
        address: company.company_address,
        social_media: company.social_media,
        seo_settings: company.seo_settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company information
// @route   PUT /api/company
// @access  Private/Admin
const updateCompanyInfo = async (req, res, next) => {
  try {
    const { company_name, company_email, company_phone, company_address } = req.body;

    let company = await CompanySettings.findOne();

    if (!company) {
      company = await CompanySettings.create({
        company_name,
        company_email,
        company_phone,
        company_address
      });
    } else {
      await company.update({
        company_name: company_name || company.company_name,
        company_email: company_email || company.company_email,
        company_phone: company_phone || company.company_phone,
        company_address: company_address || company.company_address
      });
    }

    res.json({
      success: true,
      message: 'Company information updated successfully',
      company: {
        id: company.id,
        name: company.company_name,
        logo: company.company_logo,
        email: company.company_email,
        phone: company.company_phone,
        address: company.company_address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   POST /api/company/logo
// @access  Private/Admin
const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    let company = await CompanySettings.findOne();

    // Delete old logo if exists
    if (company && company.company_logo) {
      const publicId = company.company_logo.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`agricultural-marketplace/company/${publicId}`);
    }

    if (!company) {
      company = await CompanySettings.create({
        company_logo: req.file.path
      });
    } else {
      await company.update({
        company_logo: req.file.path
      });
    }

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logo: req.file.path
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact information
// @route   GET /api/company/contact
// @access  Public
const getContactInfo = async (req, res, next) => {
  try {
    const company = await CompanySettings.findOne();

    res.json({
      success: true,
      contact: {
        email: company?.company_email,
        phone: company?.company_phone,
        address: company?.company_address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact information
// @route   PUT /api/company/contact
// @access  Private/Admin
const updateContactInfo = async (req, res, next) => {
  try {
    const { email, phone, address } = req.body;

    const company = await CompanySettings.findOne();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company settings not found'
      });
    }

    await company.update({
      company_email: email || company.company_email,
      company_phone: phone || company.company_phone,
      company_address: address || company.company_address
    });

    res.json({
      success: true,
      message: 'Contact information updated successfully',
      contact: {
        email: company.company_email,
        phone: company.company_phone,
        address: company.company_address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get social media links
// @route   GET /api/company/social
// @access  Public
const getSocialLinks = async (req, res, next) => {
  try {
    const company = await CompanySettings.findOne();

    res.json({
      success: true,
      social: company?.social_media || {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update social media links
// @route   PUT /api/company/social
// @access  Private/Admin
const updateSocialLinks = async (req, res, next) => {
  try {
    const { facebook, twitter, instagram, linkedin } = req.body;

    const company = await CompanySettings.findOne();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company settings not found'
      });
    }

    const social_media = {
      facebook: facebook || company.social_media?.facebook,
      twitter: twitter || company.social_media?.twitter,
      instagram: instagram || company.social_media?.instagram,
      linkedin: linkedin || company.social_media?.linkedin
    };

    await company.update({ social_media });

    res.json({
      success: true,
      message: 'Social links updated successfully',
      social: social_media
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SEO settings
// @route   GET /api/company/seo
// @access  Private/Admin
const getSeoSettings = async (req, res, next) => {
  try {
    const company = await CompanySettings.findOne();

    res.json({
      success: true,
      seo: company?.seo_settings || {
        title: 'AgriMarket - Fresh Agricultural Products',
        description: 'Buy fresh agricultural products online',
        keywords: 'agriculture, farming, fresh produce, grains, cereals',
        ogImage: null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update SEO settings
// @route   PUT /api/company/seo
// @access  Private/Admin
const updateSeoSettings = async (req, res, next) => {
  try {
    const { title, description, keywords, ogImage } = req.body;

    const company = await CompanySettings.findOne();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company settings not found'
      });
    }

    const seo_settings = {
      title: title || company.seo_settings?.title,
      description: description || company.seo_settings?.description,
      keywords: keywords || company.seo_settings?.keywords,
      ogImage: ogImage || company.seo_settings?.ogImage
    };

    await company.update({ seo_settings });

    res.json({
      success: true,
      message: 'SEO settings updated successfully',
      seo: seo_settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanyInfo,
  updateCompanyInfo,
  uploadCompanyLogo,
  getContactInfo,
  updateContactInfo,
  getSocialLinks,
  updateSocialLinks,
  getSeoSettings,
  updateSeoSettings
};