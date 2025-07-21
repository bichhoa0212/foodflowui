import axios, { AxiosInstance } from 'axios';

// Singleton pattern cho axios instance (chỉ tạo 1 lần duy nhất cho toàn app)
let apiInstance: AxiosInstance | null = null;

/**
 * Tạo hoặc lấy lại instance axios dùng chung cho toàn bộ app.
 * - Đã cấu hình interceptor cho Authorization và refresh token.
 * - Đảm bảo chỉ có 1 instance duy nhất (singleton).
 * - Tự động thêm accessToken vào header nếu có.
 * - Tự động refresh token nếu gặp lỗi 401.
 * @returns AxiosInstance
 */
export function getApiInstance(): AxiosInstance {
  if (apiInstance) return apiInstance; // Nếu đã có thì trả về luôn

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy từ biến môi trường
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // timeout 10s
    withCredentials: true, // gửi cookie nếu có
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

  // Tự động refresh token nếu gặp lỗi 401 (token hết hạn)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Gọi API refresh token
            const response = await api.post('/auth/refresh', { refreshToken });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            error.config.headers['Authorization'] = `Bearer ${accessToken}`;
            return api.request(error.config); // Gửi lại request cũ
          } catch {
            // Nếu refresh lỗi thì xóa token và chuyển về login
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