import { createApiInstance } from './baseApi';

const api = createApiInstance();

export const restaurantAPI = {
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return api.get(`/public/categories?${query.toString()}`);
  },
  getTopPurchasedRestaurants: () => api.get('/restaurants/top-purchased'),
  getTopReviewedRestaurants: () => api.get('/restaurants/top-reviewed'),
  getRestaurantDetail: (id: number) => api.get(`/restaurants/${id}`),
  getProductsByRestaurant: (id: number) => api.get(`/restaurants/${id}/products`),
  getReviewsByRestaurant: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/restaurants/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
}; 