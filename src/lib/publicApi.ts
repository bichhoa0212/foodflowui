import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm API public (không cần đăng nhập)
 */
export const publicAPI = {
  /**
   * Lấy danh sách sản phẩm public
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
    return api.get(`/public/products?${query.toString()}`);
  },
  /**
   * Lấy danh mục sản phẩm public
   */
  getCategories: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());
    return api.get(`/public/categories?${query.toString()}`);
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
  /**
   * Lấy review của sản phẩm
   */
  getReviewsByProduct: (id: number, page = 0, size = 5, rating?: number, sort: 'asc' | 'desc' = 'desc') => {
    let url = `/products/${id}/reviews?page=${page}&size=${size}&sort=${sort}`;
    if (rating !== undefined) url += `&rating=${rating}`;
    return api.get(url);
  },
};