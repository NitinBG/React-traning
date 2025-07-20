import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartId: localStorage.getItem('cartId') || null,
  items: [],
  isOpen: false,
  totalQuantity: 0,
  loading: false,
  loadingProducts: {},
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartId: (state, action) => {
      state.cartId = action.payload;
      localStorage.setItem('cartId', action.payload);
    },
    setCartItems: (state, action) => {
      state.items = action.payload.items || [];
      state.totalQuantity = action.payload.total_quantity || 0;
    },
    toggleMiniCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeMiniCart: (state) => {
      state.isOpen = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setProductLoading: (state, action) => {
      const { sku, isLoading } = action.payload;
      state.loadingProducts[sku] = isLoading;
      if (isLoading) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.loadingProducts = {};
    }
  }
});

export const {
  setCartId,
  setCartItems,
  toggleMiniCart,
  closeMiniCart,
  setLoading,
  setProductLoading,
  setError
} = cartSlice.actions;

export const selectCartId = (state) => state.cart.cartId;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => state.cart.totalQuantity;
export const selectIsMiniCartOpen = (state) => state.cart.isOpen;
export const selectCartLoading = (state) => state.cart.loading;
export const selectProductLoading = (sku) => (state) => state.cart.loadingProducts[sku] || false;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer; 