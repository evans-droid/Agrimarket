import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { FiShoppingCart, FiMinus, FiPlus, FiHeart, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const [productRes, relatedRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get(`/api/products/${id}/related`)
      ]);
      setProduct(productRes.data.product);
      setRelatedProducts(relatedRes.data.products);
    } catch (error) {
      console.error('Fetch product error:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      if (newValue < 1) return 1;
      if (newValue > product.stock_quantity) return product.stock_quantity;
      return newValue;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!product) return null;

  const images = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  return (
    <div className="space-y-12">
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden aspect-square">
            <img 
              src={images[selectedImage] || '/api/placeholder/600/600'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden aspect-square border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-green-600' 
                      : 'border-transparent hover:border-green-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                {product.category?.name}
              </span>
              <span>•</span>
              <span>Added {new Date(product.date_added).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                GH₵{product.price}
              </span>
              {product.old_price && (
                <span className="text-lg text-gray-400 line-through">
                  GH₵{product.old_price}
                </span>
              )}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Availability:</span>
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock_quantity > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <FiMinus />
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_quantity}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FiHeart className="text-xl" />
            </button>
            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FiShare2 className="text-xl" />
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Delivery Info</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Free delivery for orders above GH₵100
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Returns</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  7-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
