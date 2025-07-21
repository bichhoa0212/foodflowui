import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến nhà hàng (restaurant)
 */
export const restaurantAPI = {
  /**
   * Lấy danh mục nhà hàng
   */
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return api.get(`/public/categories?${query.toString()}`);
  },
  /**
   * Lấy top nhà hàng bán chạy
   */
  getTopPurchasedRestaurants: () => api.get('/restaurants/top-purchased'),
  /**
   * Lấy top nhà hàng được review nhiều
   */
  getTopReviewedRestaurants: () => api.get('/restaurants/top-reviewed'),
  /**
   * Lấy chi tiết nhà hàng
   */
  getRestaurantDetail: (id: number) => api.get(`/restaurants/${id}`),
  /**
   * Lấy sản phẩm của nhà hàng
   */
  getProductsByRestaurant: (id: number) => api.get(`/restaurants/${id}/products`),
  /**
   * Lấy review của nhà hàng
   */
  getReviewsByRestaurant: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/restaurants/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
}; 