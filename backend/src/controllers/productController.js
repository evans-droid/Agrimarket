const Product = require('../models/products');
const Category = require('../models/category');
const { Op } = require('sequelize');

// Get all products with pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const category = req.query.category;
        const search = req.query.search;
        const sort = req.query.sort || 'date_added';
        const order = req.query.order || 'DESC';

        let whereClause = { is_active: true };
        
        if (category) {
            whereClause.category_id = category;
        }
        
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: ['category'],
            limit,
            offset,
            order: [[sort, order]]
        });

        res.json({
            success: true,
            products,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: ['category']
        });

        if (!product || !product.is_active) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: true },
            include: ['category'],
            limit: 8,
            order: [['date_added', 'DESC']]
        });

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getCategories,
    getFeaturedProducts
};
