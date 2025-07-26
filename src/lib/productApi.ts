"use client";

import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến sản phẩm (product)
 * - Sử dụng axios instance chung (api)
 * - Trả về promise, cần xử lý lỗi ở nơi gọi
 */
export const productAPI = {
  /**
   * Lấy chi tiết sản phẩm theo id
   * @param id - id sản phẩm
   * @returns Promise<AxiosResponse>
   */
  getProductDetail: (id: number) => api.get(`/products/${id}`),
  /**
   * Lấy danh sách sản phẩm với filter
   * @param params - các tham số lọc, phân trang, sắp xếp
   * @returns Promise<AxiosResponse>
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
   * @returns Promise<AxiosResponse>
   */
  getTopPurchasedProducts: () => api.get('/products/top-purchased'),
  /**
   * Lấy top sản phẩm được review nhiều
   * @returns Promise<AxiosResponse>
   */
  getTopReviewedProducts: () => api.get('/products/top-reviewed'),
  /**
   * Lấy review của sản phẩm
   * @param id - id sản phẩm
   * @param page - trang
   * @param size - số lượng mỗi trang
   * @param rating - lọc theo rating
   * @param sort - sắp xếp asc/desc
   * @returns Promise<AxiosResponse>
   */
  getReviewsByProduct: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/products/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
};

/**
 * Lấy danh sách tất cả danh mục sản phẩm (public API - không cần auth)
 */
export const getCategories = async (page = 0, size = 50) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/categories?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Lấy top N sản phẩm bán chạy nhất (public API - không cần auth)
 */
export const getTopSellingProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/products/top-selling`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
};
