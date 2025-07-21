"use client";

import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến sản phẩm (product)
 */
export const productAPI = {
  /**
   * Lấy chi tiết sản phẩm theo id
   */
  getProductDetail: (id: number) => api.get(`/products/${id}`),
  /**
   * Lấy danh sách sản phẩm với filter
   */
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
  /**
   * Lấy top sản phẩm bán chạy
   */
  getTopPurchasedProducts: () => api.get('/products/top-purchased'),
  /**
   * Lấy top sản phẩm được review nhiều
   */
  getTopReviewedProducts: () => api.get('/products/top-reviewed'),
  /**
   * Lấy review của sản phẩm
   */
  getReviewsByProduct: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/products/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
};
