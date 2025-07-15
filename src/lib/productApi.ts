"use client";

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Interceptor: tự động gắn token cho các API không phải /public
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('[productApi] Set Authorization header:', config.headers['Authorization']);
      } else {
        console.log('[productApi] No accessToken found in localStorage');
      }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productAPI = {
  getProductDetail: (id: number) => {
    return api.get(`/products/${id}`);
  },
};
