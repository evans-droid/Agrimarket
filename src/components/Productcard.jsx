import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden group">
          <img 
            src={product.image_url || 'https://placehold.co/400x320?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.stock_quantity < 10 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
              {product.name}
            </h3>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              {product.category?.name}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                GH₵{product.price}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                / unit
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Stock: {product.stock_quantity}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            product.stock_quantity > 0
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          <FiShoppingCart />
          <span>{product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
        
        <Link
          to={`/products/${product.id}`}
          className="p-2 border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
        >
          <FiEye className="text-xl" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
