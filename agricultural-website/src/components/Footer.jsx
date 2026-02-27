import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { useCompany } from '../context/CompanyContext';

const Footer = () => {
  const { company } = useCompany();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              {company?.name || 'AgriMarket'}
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted source for fresh agricultural products straight from local farmers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FiInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-green-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=1" className="text-gray-400 hover:text-green-400 transition-colors">
                  Cereals
                </Link>
              </li>
              <li>
                <Link to="/products?category=2" className="text-gray-400 hover:text-green-400 transition-colors">
                  Grains
                </Link>
              </li>
              <li>
                <Link to="/products?category=3" className="text-gray-400 hover:text-green-400 transition-colors">
                  Flour
                </Link>
              </li>
              <li>
                <Link to="/products?category=4" className="text-gray-400 hover:text-green-400 transition-colors">
                  Legumes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {company?.address && (
                <li className="flex items-start space-x-3 text-gray-400">
                  <FiMapPin className="mt-1 flex-shrink-0" />
                  <span>{company.address}</span>
                </li>
              )}
              {company?.phone && (
                <li className="flex items-center space-x-3 text-gray-400">
                  <FiPhone />
                  <a href={`tel:${company.phone}`} className="hover:text-green-400 transition-colors">
                    {company.phone}
                  </a>
                </li>
              )}
              {company?.email && (
                <li className="flex items-center space-x-3 text-gray-400">
                  <FiMail />
                  <a href={`mailto:${company.email}`} className="hover:text-green-400 transition-colors">
                    {company.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {company?.name || 'AgriMarket'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;