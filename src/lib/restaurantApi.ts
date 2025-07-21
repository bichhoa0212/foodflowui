import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm liên quan đến nhà hàng (restaurant)
 * - Sử dụng axios instance chung (api)
 * - Trả về promise, cần xử lý lỗi ở nơi gọi
 */
export const restaurantAPI = {
  /**
   * Lấy danh mục nhà hàng
   * @param params - phân trang
   * @returns Promise<AxiosResponse>
   */
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return api.get(`/public/categories?${query.toString()}`);
  },
  /**
   * Lấy top nhà hàng bán chạy
   * @returns Promise<AxiosResponse>
   */
  getTopPurchasedRestaurants: () => api.get('/restaurants/top-purchased'),
  /**
   * Lấy top nhà hàng được review nhiều
   * @returns Promise<AxiosResponse>
   */
  getTopReviewedRestaurants: () => api.get('/restaurants/top-reviewed'),
  /**
   * Lấy chi tiết nhà hàng
   * @param id - id nhà hàng
   * @returns Promise<AxiosResponse>
   */
  getRestaurantDetail: (id: number) => api.get(`/restaurants/${id}`),
  /**
   * Lấy sản phẩm của nhà hàng
   * @param id - id nhà hàng
   * @returns Promise<AxiosResponse>
   */
  getProductsByRestaurant: (id: number) => api.get(`/restaurants/${id}/products`),
  /**
   * Lấy review của nhà hàng
   * @param id - id nhà hàng
   * @param page - trang
   * @param size - số lượng mỗi trang
   * @param rating - lọc theo rating
   * @param sort - sắp xếp asc/desc
   * @returns Promise<AxiosResponse>
   */
  getReviewsByRestaurant: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/restaurants/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
}; 