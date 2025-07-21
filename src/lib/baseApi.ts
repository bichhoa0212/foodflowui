import axios, { AxiosInstance } from 'axios';

// Singleton pattern cho axios instance
let apiInstance: AxiosInstance | null = null;

/**
 * Tạo hoặc lấy lại instance axios dùng chung cho toàn bộ app.
 * Đã cấu hình interceptor cho Authorization và refresh token.
 */
export function getApiInstance(): AxiosInstance {
  if (apiInstance) return apiInstance;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy từ biến môi trường
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true,
  });

  // Thêm accessToken vào header nếu có
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Tự động refresh token nếu 401
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
            error.config.headers['Authorization'] = `Bearer ${accessToken}`;
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

  apiInstance = api;
  return apiInstance;
} 