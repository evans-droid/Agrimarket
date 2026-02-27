import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    delivery_address: user?.delivery_address || ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/users/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        My Profile
      </h1>

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <FiUser className="mr-2" />
            Personal Information
          </h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-green-600 hover:text-green-700 flex items-center"
            >
              <FiEdit2 className="mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setEditing(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                <FiX />
              </button>
              <button
                onClick={handleSubmit}
                className="text-green-600 hover:text-green-700"
              >
                <FiSave />
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <FiUser className="text-gray-400 w-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-400 w-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-gray-400 w-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiMapPin className="text-gray-400 w-5 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                <p className="text-gray-900 dark:text-white">{user?.delivery_address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Address
              </label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </form>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <FiPackage className="mr-2" />
          Order History
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No orders yet. Start shopping to see your orders here!
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-wrap justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order #{order.order_number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                    <span className="font-bold text-green-600">
                      GH₵{order.total_amount}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {order.items?.length} item(s)
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;