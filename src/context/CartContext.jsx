import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data.cart);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await axios.post('/api/cart', { product_id: productId, quantity });
      setCart(response.data.cart);
      toast.success('Item added to cart');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        await removeFromCart(cartItemId);
        return;
      }

      const response = await axios.put(`/api/cart/${cartItemId}`, { quantity });
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`);
      setCart(prev => prev.filter(item => item.id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCart([]);
      setTotal(0);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    loading,
    total,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
