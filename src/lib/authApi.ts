"use client";

import axios from 'axios';
import { createApiInstance } from './baseApi';

const api = createApiInstance();


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  testConnection: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/test');
      return response.ok;
    } catch {
      return false;
    }
  },
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  login: (data: AuthRequest) => api.post('/auth/login', data),
  refreshToken: (data: RefreshTokenRequest) => api.post('/auth/refresh', data),
  test: () => api.get('/auth/test'),
  corsTest: () => api.get('/auth/cors-test'),
  getDefaultUsers: () => api.get('/auth/default-users'),
  generateChecksum: (data: AuthRequest) => api.post('/auth/generate-checksum', data),
  postReviewRestaurant: (restaurantId: number, data: { rating: number; comment: string }) => api.post(`/restaurants/${restaurantId}/reviews`, { ...data }),
  updateReviewRestaurant: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/restaurants/reviews/${reviewId}`, data),
  deleteReviewRestaurant: (reviewId: number) => api.delete(`/restaurants/reviews/${reviewId}`),
  postReviewProduct: (productId: number, data: { rating: number; comment: string }) => api.post(`/products/${productId}/reviews`, { ...data }),
  updateReviewProduct: (reviewId: number, data: { rating?: number; comment?: string }) => api.put(`/products/reviews/${reviewId}`, data),
  deleteReviewProduct: (reviewId: number) => api.delete(`/products/reviews/${reviewId}`),
  orderProduct: (productId: number, data: { quantity: number; deliveryAddress: string; contactPhone: string; notes?: string }) => api.post(`/products/${productId}/order`, data),
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