import axios, { AxiosInstance } from 'axios';

// Singleton pattern cho axios instance (chỉ tạo 1 lần duy nhất cho toàn app)
let apiInstance: AxiosInstance | null = null;

// Flag để tránh vòng lặp vô hạn khi refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

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
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Nếu đang refresh, thêm request vào queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api.request(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Tạo instance axios mới để tránh vòng lặp
            const refreshApi = axios.create({
              baseURL: process.env.NEXT_PUBLIC_API_URL,
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000,
            });

            // Gọi API refresh token
            const response = await refreshApi.post('/auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Lưu token mới
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Cập nhật header cho request gốc
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            // Xử lý queue
            processQueue(null, accessToken);
            
            return api.request(originalRequest);
          } catch (refreshError) {
            // Nếu refresh lỗi thì xóa token và chuyển về login
            processQueue(refreshError, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Chỉ redirect nếu đang ở client side
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Không có refresh token
          processQueue(error, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  apiInstance = api;
  return apiInstance;
} 