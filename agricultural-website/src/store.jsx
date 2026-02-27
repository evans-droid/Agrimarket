import { configureStore, createSlice } from '@reduxjs/toolkit';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null
  },
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    fetchCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    }
  }
});

// Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 12
    }
  },
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.products;
      state.pagination = action.payload.pagination;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFeaturedSuccess: (state, action) => {
      state.featured = action.payload;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  }
});

// Order Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const order = state.items.find(o => o.id === action.payload.id);
      if (order) {
        order.order_status = action.payload.status;
      }
    }
  }
});

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    sidebarOpen: false,
    cartDrawerOpen: false,
    searchDrawerOpen: false,
    notifications: [],
    loading: {
      global: false,
      button: false
    }
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.cartDrawerOpen = action.payload;
    },
    toggleSearchDrawer: (state) => {
      state.searchDrawerOpen = !state.searchDrawerOpen;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setButtonLoading: (state, action) => {
      state.loading.button = action.payload;
    }
  }
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser
} = authSlice.actions;

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchFeaturedSuccess,
  fetchCategoriesSuccess,
  setCurrentProduct,
  setPage
} = productSlice.actions;

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  setCurrentOrder,
  addOrder,
  updateOrderStatus
} = orderSlice.actions;

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleSearchDrawer,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setButtonLoading
} = uiSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    products: productSlice.reducer,
    orders: orderSlice.reducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// Selectors
export const selectAuth = (state) => state.auth;
export const selectCart = (state) => state.cart;
export const selectProducts = (state) => state.products;
export const selectOrders = (state) => state.orders;
export const selectUI = (state) => state.ui;

// Async action creators
export const fetchProducts = (params) => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const response = await api.get('/products', { params });
    dispatch(fetchProductsSuccess(response.data));
  } catch (error) {
    dispatch(fetchProductsFailure(error.message));
  }
};

export const fetchCart = () => async (dispatch) => {
  try {
    dispatch(fetchCartStart());
    const response = await api.get('/cart');
    dispatch(fetchCartSuccess(response.data));
  } catch (error) {
    dispatch(fetchCartFailure(error.message));
  }
};

export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    const response = await api.get('/orders');
    dispatch(fetchOrdersSuccess(response.data.orders));
  } catch (error) {
    dispatch(fetchOrdersFailure(error.message));
  }
};

export default store;