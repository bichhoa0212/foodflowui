"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Kiểu dữ liệu cho item trong giỏ hàng
 * - productId: mã sản phẩm
 * - name: tên sản phẩm
 * - imageUrl: ảnh sản phẩm
 * - price: giá
 * - quantity: số lượng
 */
export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

/**
 * Kiểu dữ liệu context giỏ hàng
 * - cart: danh sách sản phẩm trong giỏ
 * - addToCart: thêm sản phẩm vào giỏ
 * - removeFromCart: xóa sản phẩm khỏi giỏ
 * - updateQuantity: cập nhật số lượng sản phẩm
 * - clearCart: xóa toàn bộ giỏ hàng
 */
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
 * Đảm bảo chỉ dùng trong CartProvider, nếu không sẽ throw lỗi.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

/**
 * Provider quản lý trạng thái giỏ hàng toàn cục
 * - Lưu trạng thái giỏ hàng vào localStorage
 * - Cung cấp các hàm thao tác với giỏ hàng
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Danh sách sản phẩm trong giỏ

  // Load cart từ localStorage khi mount (chỉ chạy 1 lần)
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Lưu cart vào localStorage mỗi khi thay đổi (đồng bộ đa tab)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Thêm sản phẩm vào giỏ:
   * - Nếu đã có thì cộng dồn số lượng
   * - Nếu chưa có thì thêm mới
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
   * Xóa sản phẩm khỏi giỏ theo productId
   */
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   * - Nếu productId không tồn tại thì không thay đổi gì
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