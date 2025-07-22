import { getApiInstance } from './baseApi';

const api = getApiInstance();

/**
 * Các hàm API public (không cần đăng nhập)
 * - Sử dụng axios instance chung (api)
 * - Trả về promise, cần xử lý lỗi ở nơi gọi
 */
export const publicAPI = {
  /**
   * Lấy danh sách sản phẩm public
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
    return api.get(`/public/products?${query.toString()}`);
  },
  /**
   * Lấy danh mục sản phẩm public
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
   * Lấy top sản phẩm bán chạy
   * @returns Promise<AxiosResponse>
   */
  getTopPurchasedProducts: () => api.get('/products/top-purchased'),
  /**
   * Lấy top sản phẩm được review nhiều
   * @returns Promise<AxiosResponse>
   */
  getTopReviewedProducts: () => api.get('/products/top-reviewed'),
  // Đã loại bỏ các hàm liên quan đến nhà hàng (restaurant)
};