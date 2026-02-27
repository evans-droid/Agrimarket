const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Cart = require('../models/cart');
const Product = require('../models/products');
const { processMobileMoneyPayment } = require('../utils/paymentService');
const { sequelize } = require('../config/database');

// Create order
const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { delivery_address, phone_number, payment_method } = req.body;

        // Get user's cart
        const cartItems = await Cart.findAll({
            where: { user_id: req.user.id },
            include: ['product'],
            transaction
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total and check stock
        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.product.stock_quantity < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: `Insufficient stock for ${item.product.name}` 
                });
            }
            totalAmount += item.product.price * item.quantity;
        }

        // Generate order number
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Create order
        const order = await Order.create({
            order_number: orderNumber,
            user_id: req.user.id,
            total_amount: totalAmount,
            delivery_address,
            phone_number,
            payment_method,
            payment_status: 'pending',
            order_status: 'pending'
        }, { transaction });

        // Create order items and update stock
        for (const item of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_time: item.product.price
            }, { transaction });

            // Update stock
            await Product.update({
                stock_quantity: item.product.stock_quantity - item.quantity
            }, {
                where: { id: item.product_id },
                transaction
            });
        }

        // Process payment
        if (payment_method === 'mobile_money') {
            const paymentResult = await processMobileMoneyPayment({
                amount: totalAmount,
                phone: phone_number,
                orderId: order.id
            });

            if (paymentResult.success) {
                order.payment_status = 'completed';
                order.transaction_id = paymentResult.transactionId;
                await order.save({ transaction });
            }
        }

        // Clear cart
        await Cart.destroy({
            where: { user_id: req.user.id },
            transaction
        });

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: OrderItem,
                include: ['product']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: [{
                model: OrderItem,
                include: ['product']
            }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};