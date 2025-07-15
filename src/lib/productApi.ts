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
  getProducts: (params: {
    page?: number;
    size?: number;
    categoryId?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    name?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.sort) query.append('sort', params.sort);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.name) query.append('name', params.name);
    return api.get(`/products?${query.toString()}`);
  },
  getTopPurchasedProducts: () => api.get('/products/top-purchased'),
  getTopReviewedProducts: () => api.get('/products/top-reviewed'),
  getReviewsByProduct: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/products/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
};
