import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const productAPI = {
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
    return api.get(`/public/products?${query.toString()}`);
  },
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return api.get(`/public/categories?${query.toString()}`);
  },
  getProductDetail: (id: number) => {
    return api.get(`/products/${id}`);
  },
};

// Có thể bổ sung types cho Product, Category nếu cần sau này 