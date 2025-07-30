// src/context/CartContext.jsx
import React, { createContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // ... (existing addToCart logic)
    const exist = cartItems.find((x) => x.product_id === product.product_id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.product_id === product.product_id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // --- ADD THIS FUNCTION ---
  const clearCart = () => {
    setCartItems([]);
  };

  // --- ADD clearCart TO THE VALUE ---
  const value = {
    cartItems,
    addToCart,
    clearCart // <-- Add this
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;