import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/CartContext';
import { CompanyProvider } from './context/CompanyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/adminRoute';
import Home from './pages/Home';
import Products from './pages/products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Carts';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './admin/adminDashoard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageUsers from './admin/ManageUsers';
import CompanySettings from './admin/Companysettings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CompanyProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    
                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<OrderHistory />} />
                    </Route>
                    
                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<ManageProducts />} />
                      <Route path="/admin/orders" element={<ManageOrders />} />
                      <Route path="/admin/users" element={<ManageUsers />} />
                      <Route path="/admin/settings" element={<CompanySettings />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </div>
            </Router>
          </CompanyProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;