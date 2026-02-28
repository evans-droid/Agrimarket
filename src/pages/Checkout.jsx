import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { FiShoppingCart, FiCreditCard, FiMapPin, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
  const [formData, setFormData] = useState({
    payment_method: 'cash_on_delivery',
    delivery_address: user?.delivery_address || '',
    delivery_phone: user?.phone || '',
    notes: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCartItems(response.data.items || []);
      
      const total = response.data.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      setOrderTotal(total);
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to load cart');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.delivery_address) {
      toast.error('Please provide a delivery address');
      return;
    }

    if (!formData.delivery_phone) {
      toast.error('Please provide a contact phone number');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.price
        })),
        total_amount: orderTotal,
        delivery_address: formData.delivery_address,
        delivery_phone: formData.delivery_phone,
        payment_method: formData.payment_method,
        notes: formData.notes
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate('/order-history');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = orderTotal >= 100 ? 0 : 15;
  const finalTotal = orderTotal + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiMapPin className="mr-2" />
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Address
                </label>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your full delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="delivery_phone"
                  value={formData.delivery_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Any special instructions?"
                />
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiCreditCard className="mr-2" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="payment_method"
                  value="cash_on_delivery"
                  checked={formData.payment_method === 'cash_on_delivery'}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Cash on Delivery
                  </span>
                  <span className="block text-sm text-gray-500">
                    Pay when you receive your order
                  </span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 opacity-50">
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={handleChange}
                  disabled
                  className="h-4 w-4 text-green-600"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Card Payment
                  </span>
                  <span className="block text-sm text-gray-500">
                    Coming soon
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiShoppingCart className="mr-2" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mr-3">
                        <img 
                          src={item.product?.image_url || '/api/placeholder/100/100'} 
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × GH₵{item.product?.price}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      GH₵{(item.product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>GH₵{orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <FiTruck className="mr-1" />
                  Delivery {orderTotal >= 100 && <span className="text-green-600 ml-1">(Free over GH₵100)</span>}
                </span>
                <span>{deliveryFee === 0 ? 'Free' : `GH₵${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>GH₵{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || cartItems.length === 0}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Place Order
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
