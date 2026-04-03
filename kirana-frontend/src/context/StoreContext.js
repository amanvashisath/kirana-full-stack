import React, { createContext, useContext, useReducer } from 'react';
import { initialProducts, initialSales } from '../data/seedData';

const StoreContext = createContext();

const initialState = {
  products: initialProducts,
  sales: initialSales,
  cart: [],
  storeName: "Sharma General Store",
  storeOwner: "Rajesh Sharma",
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId);
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };
    }
    case 'UPDATE_CART_QTY':
      if (action.payload.qty <= 0) {
        return { ...state, cart: state.cart.filter(i => i.productId !== action.payload.productId) };
      }
      return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: action.payload.qty } : i) };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'COMPLETE_SALE': {
      const sale = { ...action.payload, id: Date.now(), date: new Date().toISOString() };
      const updatedProducts = state.products.map(p => {
        const cartItem = state.cart.find(i => i.productId === p.id);
        if (cartItem) return { ...p, stock: p.stock - cartItem.qty };
        return p;
      });
      return { ...state, sales: [sale, ...state.sales], cart: [], products: updatedProducts };
    }
    case 'UPDATE_STORE_INFO':
      return { ...state, storeName: action.payload.storeName, storeOwner: action.payload.storeOwner };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
