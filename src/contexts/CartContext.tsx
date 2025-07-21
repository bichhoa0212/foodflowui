"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Kiểu dữ liệu cho item trong giỏ hàng
export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

// Kiểu dữ liệu context
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Custom hook sử dụng CartContext
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

/**
 * Provider quản lý trạng thái giỏ hàng toàn cục
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Thêm sản phẩm vào giỏ (nếu đã có thì cộng dồn số lượng)
   */
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exist = prev.find(i => i.productId === item.productId);
      if (exist) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  /**
   * Xóa sản phẩm khỏi giỏ
   */
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 