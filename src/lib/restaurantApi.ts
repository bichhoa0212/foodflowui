import axios from 'axios';

const restaurantApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Interceptor: tự động gắn token cho các API không phải /public
restaurantApi.interceptors.request.use(
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

export const restaurantAPI = {
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return restaurantApi.get(`/public/categories?${query.toString()}`);
  },
  getTopPurchasedRestaurants: () => restaurantApi.get('/restaurants/top-purchased'),
  getTopReviewedRestaurants: () => restaurantApi.get('/restaurants/top-reviewed'),
  getRestaurantDetail: (id: number) => restaurantApi.get(`/restaurants/${id}`),
  getProductsByRestaurant: (id: number) => restaurantApi.get(`/restaurants/${id}/products`),
  getReviewsByRestaurant: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/restaurants/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return restaurantApi.get(url);
  },
}; 