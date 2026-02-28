import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiAward } from 'react-icons/fi';
import millImage from '../assets/images/Mill.jpeg';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products/featured'),
        axios.get('/api/categories')
      ]);
      setFeaturedProducts(productsRes.data?.products || []);
      setCategories(categoriesRes.data?.categories || []);
    } catch (error) {
      console.error('Fetch home data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiTruck,
      title: 'Free Delivery',
      description: 'Free shipping on orders above GH₵100'
    },
    {
      icon: FiShield,
      title: 'Quality Guarantee',
      description: '100% fresh agricultural products'
    },
    {
      icon: FiClock,
      title: '24/7 Support',
      description: 'Round the clock customer service'
    },
    {
      icon: FiAward,
      title: 'Best Prices',
      description: 'Direct from farmers, best market prices'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1590779033100-94f60f7a7e97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80react-router-dom.js?v=84e4c0e2:4436 ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.

react-router-dom.js?v=84e4c0e2:4436 ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
api/products/featured:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Home.jsx:27 Fetch home data error: AxiosError: Request failed with status code 500
    at async Promise.all (index 0)
    at async fetchData (Home.jsx:20:44)
api/categories:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
api/admin/settings:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
CompanyContext.jsx:33 Fetch company settings error: AxiosError: Request failed with status code 500
    at async fetchCompanySettings (CompanyContext.jsx:30:24)
api/products/featured:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Home.jsx:27 Fetch home data error: AxiosError: Request failed with status code 500
    at async Promise.all (index 0)
    at async fetchData (Home.jsx:20:44)
api/categories:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
api/admin/settings:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
CompanyContext.jsx:33 Fetch company settings error: AxiosError: Request failed with status code 500
    at async fetchCompanySettings (CompanyContext.jsx:30:24)
api/products/categories:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
products.jsx:39 Fetch categories error: AxiosError: Request failed with status code 500
    at async fetchCategories (products.jsx:36:24)
api/products?page=1&…_added&order=DESC:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
products.jsx:56 Fetch products error: AxiosError: Request failed with status code 500
    at async fetchProducts (products.jsx:52:24)
api/products/categories:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
products.jsx:39 Fetch categories error: AxiosError: Request failed with status code 500
    at async fetchCategories (products.jsx:36:24)
api/products?page=1&…_added&order=DESC:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
products.jsx:56 Fetch products error: AxiosError: Request failed with status code 500
    at async fetchProducts (products.jsx:52:24)
" 
            alt="Fresh agricultural products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Fresh from Farm to Your Table
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover the finest selection of agricultural products directly from local farmers. 
              Quality you can trust, prices you'll love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
              >
                Shop Now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <feature.icon className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/products?category=${category.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Featured Products
          </h2>
          <Link 
            to="/products" 
            className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
          >
            View All
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get updates about new products, special offers, and farming tips directly in your inbox.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;