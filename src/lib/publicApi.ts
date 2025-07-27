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
   * Lấy top sản phẩm được đánh giá nhiều nhất
   * @returns Promise<AxiosResponse>
   */
  getTopReviewedProducts: () => api.get('/products/top-reviewed'),
  
  /**
   * Lấy top 10 sản phẩm bán chạy nhất (public API)
   * @returns Promise<AxiosResponse>
   */
  getTopSellingProducts: () => api.get('/public/products/top-selling'),
  
  /**
   * Lấy top 10 sản phẩm có khuyến mãi (public API)
   * @returns Promise<AxiosResponse>
   */
  getTopDiscountedProducts: () => api.get('/public/products/top-discounted'),
  
  /**
   * Lấy top 10 sản phẩm mới nhất (public API)
   * @returns Promise<AxiosResponse>
   */
  getTopNewestProducts: () => api.get('/public/products/top-newest'),
  
  /**
   * Tìm kiếm sản phẩm theo tên (public API)
   * @param name tên sản phẩm cần tìm
   * @returns Promise<AxiosResponse>
   */
  searchProducts: (name: string) => api.get(`/public/products/search?name=${encodeURIComponent(name)}`),

};