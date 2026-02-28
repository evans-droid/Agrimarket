const Product = require('../models/products');
const Category = require('../models/category');
const Order = require('../models/order');
const User = require('../models/user');
const CompanySettings = require('../models/companySettings');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalUsers = await User.count({ where: { role_id: 2 } });
        
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: ['user']
        });

        const lowStockProducts = await Product.findAll({
            where: {
                stock_quantity: { [Op.lte]: 10 }
            },
            limit: 5
        });

        res.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                recentOrders,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products (for admin)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: ['category'],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Product management
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id } = req.body;
        
        let image_url = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            image_url = result.secure_url;
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock_quantity,
            category_id,
            image_url
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, stock_quantity, category_id, is_active } = req.body;
        
        let image_url = product.image_url;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            image_url = result.secure_url;
        }

        await product.update({
            name,
            description,
            price,
            stock_quantity,
            category_id,
            image_url,
            is_active
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Soft delete
        await product.update({ is_active: false });

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Order management
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            include: ['user', 'items'],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            orders,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { order_status, payment_status } = req.body;
        
        const order = await Order.findByPk(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update({
            order_status,
            payment_status
        });

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User management
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role_id: 2 },
            attributes: { exclude: ['password', 'reset_password_token'] }
        });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ is_active });

        res.json({
            success: true,
            message: 'User status updated'
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Company settings
const getCompanySettings = async (req, res) => {
    try {
        const settings = await CompanySettings.findOne();
        res.json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Get company settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCompanySettings = async (req, res) => {
    try {
        const { company_name, company_email, company_phone, company_address } = req.body;
        
        let settings = await CompanySettings.findOne();
        
        if (!settings) {
            settings = await CompanySettings.create({
                company_name,
                company_email,
                company_phone,
                company_address
            });
        } else {
            let logo_url = settings.company_logo;
            if (req.file) {
                const result = await uploadToCloudinary(req.file.path);
                logo_url = result.secure_url;
            }

            await settings.update({
                company_name,
                company_email,
                company_phone,
                company_address,
                company_logo: logo_url
            });
        }

        res.json({
            success: true,
            message: 'Company settings updated',
            settings
        });
    } catch (error) {
        console.error('Update company settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboardStats,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    updateUserStatus,
    getCompanySettings,
    updateCompanySettings
};
