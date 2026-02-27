const Cart = require('../models/cart');
const Product = require('../models/products');

// Get user cart
const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: req.user.id },
            include: ['product']
        });

        const total = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            cart: cartItems,
            total
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check product availability
        const product = await Product.findByPk(product_id);
        if (!product || !product.is_active) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock_quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: {
                user_id: req.user.id,
                product_id
            }
        });

        if (cartItem) {
            // Update quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = await Cart.create({
                user_id: req.user.id,
                product_id,
                quantity
            });
        }

        // Get updated cart
        const cartItems = await Cart.findAll({
            where: { user_id: req.user.id },
            include: ['product']
        });

        res.json({
            success: true,
            message: 'Item added to cart',
            cart: cartItems
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await Cart.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: ['product']
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (cartItem.product.stock_quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({
            success: true,
            message: 'Cart updated',
            cartItem
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove from cart
const removeFromCart = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        await Cart.destroy({
            where: { user_id: req.user.id }
        });

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};