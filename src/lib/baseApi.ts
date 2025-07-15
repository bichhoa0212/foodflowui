import axios, { AxiosInstance } from 'axios';

export function createApiInstance(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // <-- lấy từ biến môi trường
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });


  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('[api] Set Authorization header:', config.headers['Authorization']);
      } else {
        console.log('[api] No accessToken found in localStorage');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
} 