export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile_money',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

export const MOBILE_MONEY_PROVIDERS = [
  { id: 'mtn', name: 'MTN Mobile Money', code: 'MTN' },
  { id: 'vodafone', name: 'Vodafone Cash', code: 'VDF' },
  { id: 'airteltigo', name: 'AirtelTigo Money', code: 'TGO' }
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const PRODUCT_SORT_OPTIONS = [
  { value: 'date_added_desc', label: 'Newest First' },
  { value: 'date_added_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];

export const CATEGORIES = [
  { id: 1, name: 'Cereals', icon: '🌾' },
  { id: 2, name: 'Grains', icon: '🌽' },
  { id: 3, name: 'Flour', icon: '🍚' },
  { id: 4, name: 'Legumes', icon: '🫘' }
];

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  CART: 'cart',
  USER: 'user'
};