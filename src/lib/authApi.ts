"use client";

import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến xác thực, đăng ký, refresh token, review, order...
 * Input/Output đều trả về Promise từ axios.
 */
export const authAPI = {
  /**
   * Kiểm tra kết nối backend auth (test endpoint)
   * @returns Promise<boolean>
   */
  testConnection: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/test');
      return response.ok;
    } catch {
      return false;
    }
  },
  /**
   * Đăng ký tài khoản mới
   */
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  /**
   * Đăng nhập
   */
  login: (data: AuthRequest) => api.post('/auth/login', data),
  /**
   * Refresh token
   */
  refreshToken: (data: RefreshTokenRequest) => api.post('/auth/refresh', data),
  /**
   * Test endpoint
   */
  test: () => api.get('/auth/test'),
  /**
   * Test CORS
   */
  corsTest: () => api.get('/auth/cors-test'),
  /**
   * Lấy danh sách user mặc định
   */
  getDefaultUsers: () => api.get('/auth/default-users'),
  /**
   * Sinh checksum cho đăng nhập
   */
  generateChecksum: (data: AuthRequest) => api.post('/auth/generate-checksum', data),
  /**
   * Đánh giá nhà hàng
   */
  postReviewRestaurant: (restaurantId: number, data: { rating: number; comment: string }) => api.post(`/restaurants/${restaurantId}/reviews`, { ...data }),
  updateReviewRestaurant: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/restaurants/reviews/${reviewId}`, data),
  deleteReviewRestaurant: (reviewId: number) => api.delete(`/restaurants/reviews/${reviewId}`),
  /**
   * Đánh giá sản phẩm
   */
  postReviewProduct: (productId: number, data: { rating: number; comment: string }) => api.post(`/products/${productId}/reviews`, { ...data }),
  updateReviewProduct: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/products/reviews/${reviewId}`, data),
  deleteReviewProduct: (reviewId: number) => api.delete(`/products/reviews/${reviewId}`),
  /**
   * Đặt hàng sản phẩm đơn lẻ
   */
  orderProduct: (productId: number, data: { quantity: number; deliveryAddress: string; contactPhone: string; notes?: string }) => api.post(`/products/${productId}/order`, data),
  /**
   * Đặt hàng nhiều sản phẩm
   */
  orderProducts: (data: { items: { productId: number; quantity: number }[]; deliveryAddress: string; contactPhone: string; notes?: string }) => api.post('/products/order', data),
};

export interface RegisterRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  sex?: number;
  address?: string;
  dateOfBirth?: string;
  provider: string;
  providerUserId?: string;
  providerMetaData?: string;
  checksum?: string;
  language?: number;
  deviceName?: string;
}

export interface AuthRequest {
  provider: string;
  providerUserId: string;
  password: string;
  checksum?: string;
  language?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: {
    id: number;
    name: string;
    email: string;
    phone: string;
    roles: string[];
    permissions: string[];
  };
} 