import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const publicAPI = {
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
    return publicApi.get(`/public/products?${query.toString()}`);
  },
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return publicApi.get(`/public/categories?${query.toString()}`);
  },
  getTopPurchasedProducts: () => publicApi.get('/products/top-purchased'),
  getTopReviewedProducts: () => publicApi.get('/products/top-reviewed'),
  getTopPurchasedRestaurants: () => publicApi.get('/restaurants/top-purchased'),
  getTopReviewedRestaurants: () => publicApi.get('/restaurants/top-reviewed'),
  getRestaurantDetail: (id: number) => publicApi.get(`/restaurants/${id}`),
  getProductsByRestaurant: (id: number) => publicApi.get(`/restaurants/${id}/products`),
  getReviewsByRestaurant: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/restaurants/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return publicApi.get(url);
  },
  getReviewsByProduct: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/products/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return publicApi.get(url);
  },
};