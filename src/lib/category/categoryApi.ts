"use client";

import { getApiInstance } from '../baseApi';

const api = getApiInstance();

/**
 * Interface cho Category
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Interface cho Category Response
 */
export interface CategoryResponse {
  content: Category[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Các hàm liên quan đến danh mục (category)
 * - Sử dụng axios instance chung (api)
 * - Trả về promise, cần xử lý lỗi ở nơi gọi
 */
export const categoryAPI = {
  /**
   * Lấy danh sách tất cả danh mục (không phân trang)
   * @returns Promise<AxiosResponse>
   */
  getAllCategories: () => api.get('/categories/list'),

  /**
   * Lấy danh sách danh mục với phân trang
   * @param page - trang (0-based)
   * @param size - số lượng mỗi trang
   * @returns Promise<AxiosResponse>
   */
  getCategories: (page = 0, size = 50) => {
    const query = new URLSearchParams();
    query.append('page', page.toString());
    query.append('size', size.toString());
    return api.get(`/categories?${query.toString()}`);
  },

  /**
   * Lấy chi tiết danh mục theo id
   * @param id - id danh mục
   * @returns Promise<AxiosResponse>
   */
  getCategoryById: (id: number) => api.get(`/categories/${id}`),

  /**
   * Lấy danh sách sản phẩm theo danh mục
   * @param categoryId - id danh mục
   * @param page - trang (0-based)
   * @param size - số lượng mỗi trang
   * @returns Promise<AxiosResponse>
   */
  getProductsByCategory: (categoryId: number, page = 0, size = 12) => {
    const query = new URLSearchParams();
    query.append('page', page.toString());
    query.append('size', size.toString());
    query.append('categoryId', categoryId.toString());
    return api.get(`/products?${query.toString()}`);
  },
};

/**
 * Helper function để lấy danh sách categories (public API - không cần auth)
 * @deprecated Sử dụng categoryAPI.getAllCategories() thay thế
 */
export const getCategories = async (page = 0, size = 50) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?page=${page}&size=${size}`, {
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
 * Helper function để lấy danh sách categories với auth (sử dụng axios instance)
 */
export const getCategoriesWithAuth = async (page = 0, size = 50): Promise<CategoryResponse> => {
  try {
    const response = await categoryAPI.getCategories(page, size);
    return response.data.data; // Trả về data từ response structure
  } catch (error) {
    console.error('Error fetching categories with auth:', error);
    throw error;
  }
};

/**
 * Helper function để lấy tất cả categories không phân trang
 */
export const getAllCategoriesList = async (): Promise<Category[]> => {
  try {
    const response = await categoryAPI.getAllCategories();
    return response.data.data; // Trả về data từ response structure
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
}; 