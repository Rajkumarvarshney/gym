import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('gym_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.product && item.product._id);
      }
      return [];
    } catch (err) {
      return [];
    }
  });

  // Save cart to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('gym_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product && item.product._id === product._id);
      if (existingItem) {
        // Limit to available stock
        const newQty = Math.min(existingItem.quantity + quantity, product.stock);
        return prevItems.map((item) =>
          item.product && item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product && item.product._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product && item.product._id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 0) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Aggregators
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const totalItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
