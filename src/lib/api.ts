"use client";

import axios from 'axios';

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    let requestData = undefined;
    if (config.data) {
      try {
        if (typeof config.data === 'string') {
          requestData = JSON.parse(config.data);
        } else {
          requestData = config.data;
        }
      } catch (error) {
        requestData = config.data; // Use as is if parsing fails
      }
    }
    
    console.log('🌐 [REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: requestData
    });
    
    return config;
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    // Log response details
    console.log('📡 [RESPONSE]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error details
    let errorData = undefined;
    if (error.response?.data) {
      try {
        if (typeof error.response.data === 'string') {
          errorData = JSON.parse(error.response.data);
        } else {
          errorData = error.response.data;
        }
      } catch (parseError) {
        errorData = error.response.data; // Use as is if parsing fails
      }
    }
    
    console.error('💥 [RESPONSE ERROR]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: errorData,
      message: error.message,
      code: error.code
    });
    
    if (error.response?.status === 401) {
      // Token hết hạn, thử refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('🔄 [TOKEN REFRESH] Attempting to refresh token...');
          const response = await api.post('/auth/refresh', {
            refreshToken: refreshToken,
          });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ [TOKEN REFRESH] Token refreshed successfully');
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh token cũng hết hạn, logout
          console.log('❌ [TOKEN REFRESH] Refresh failed, logging out...');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// (Đã tách các API auth và product sang file riêng. Giữ lại các hàm dùng chung nếu có, hoặc để trống.)

// Types
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

export default api; 