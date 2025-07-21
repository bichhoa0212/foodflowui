"use client";

import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến xác thực, đăng ký, refresh token, review, order...
 * Input/Output đều trả về Promise từ axios hoặc fetch.
 *
 * Lưu ý:
 * - Các hàm trả về promise, nên cần xử lý lỗi ở nơi gọi.
 * - Một số hàm test dùng fetch, còn lại dùng axios instance chung.
 */
export const authAPI = {
  /**
   * Kiểm tra kết nối backend auth (test endpoint)
   * @returns Promise<boolean> - true nếu kết nối thành công, false nếu lỗi
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
   * @param data - thông tin đăng ký
   * @returns Promise<AxiosResponse>
   */
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  /**
   * Đăng nhập
   * @param data - thông tin đăng nhập
   * @returns Promise<AxiosResponse>
   */
  login: (data: AuthRequest) => api.post('/auth/login', data),
  /**
   * Refresh token
   * @param data - refreshToken
   * @returns Promise<AxiosResponse>
   */
  refreshToken: (data: RefreshTokenRequest) => api.post('/auth/refresh', data),
  /**
   * Test endpoint (kiểm tra backend)
   */
  test: () => api.get('/auth/test'),
  /**
   * Test CORS
   */
  corsTest: () => api.get('/auth/cors-test'),
  /**
   * Lấy danh sách user mặc định (dùng cho test/demo)
   */
  getDefaultUsers: () => api.get('/auth/default-users'),
  /**
   * Sinh checksum cho đăng nhập (bảo mật)
   * @param data - thông tin đăng nhập
   * @returns Promise<AxiosResponse>
   */
  generateChecksum: (data: AuthRequest) => api.post('/auth/generate-checksum', data),
  /**
   * Đánh giá nhà hàng
   * @param restaurantId - id nhà hàng
   * @param data - rating, comment
   */
  postReviewRestaurant: (restaurantId: number, data: { rating: number; comment: string }) => api.post(`/restaurants/${restaurantId}/reviews`, { ...data }),
  updateReviewRestaurant: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/restaurants/reviews/${reviewId}`, data),
  deleteReviewRestaurant: (reviewId: number) => api.delete(`/restaurants/reviews/${reviewId}`),
  /**
   * Đánh giá sản phẩm
   * @param productId - id sản phẩm
   * @param data - rating, comment
   */
  postReviewProduct: (productId: number, data: { rating: number; comment: string }) => api.post(`/products/${productId}/reviews`, { ...data }),
  updateReviewProduct: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/products/reviews/${reviewId}`, data),
  deleteReviewProduct: (reviewId: number) => api.delete(`/products/reviews/${reviewId}`),
  /**
   * Đặt hàng sản phẩm đơn lẻ
   * @param productId - id sản phẩm
   * @param data - thông tin đặt hàng
   */
  orderProduct: (productId: number, data: { quantity: number; deliveryAddress: string; contactPhone: string; notes?: string }) => api.post(`/products/${productId}/order`, data),
  /**
   * Đặt hàng nhiều sản phẩm
   * @param data - danh sách sản phẩm và thông tin giao hàng
   */
  orderProducts: (data: { items: { productId: number; quantity: number }[]; deliveryAddress: string; contactPhone: string; notes?: string }) => api.post('/products/order', data),
};

/**
 * Kiểu dữ liệu đăng ký tài khoản
 */
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

/**
 * Kiểu dữ liệu đăng nhập
 */
export interface AuthRequest {
  provider: string;
  providerUserId: string;
  password: string;
  checksum?: string;
  language?: number;
}

/**
 * Kiểu dữ liệu refresh token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Kiểu dữ liệu trả về khi xác thực thành công
 */
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