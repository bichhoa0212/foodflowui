import { getApiInstance } from './baseApi';
import axios from 'axios';

const api = getApiInstance();

// Instance riêng cho file upload (không có withCredentials để tránh CORS issues)
const fileApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 30000, // timeout 30s cho upload
  withCredentials: false, // không gửi credentials để tránh CORS
});

// Thêm interceptor để thêm token cho file upload
fileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface UserProfileDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  sex: number;
  dateOfBirth: string;
  avatar: string;
  provider: string;
  status: number;
  createdDate: string;
  modifiedDate: string;
  roles: string[];
  permissions: string[];
}

export interface UserAddressDto {
  id: number;
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
  status: number;
  createdDate: string;
  modifiedDate: string;
}

export interface UserFavoriteDto {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  productPrice: number;
  discountType: string;
  discountValue: number;
  productStatus: number;
  createdDate: string;
}

export interface PageData<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const userProfileApi = {
  // Profile
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (profile: Partial<UserProfileDto>) => 
    api.put('/user/profile', profile),
  
  // Avatar - sử dụng fileApi instance
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fileApi.post('/user/profile/avatar', formData);
  },
  
  deleteAvatar: () => api.delete('/user/profile/avatar'),
  
  // Addresses
  getAddresses: () => api.get('/user/profile/addresses'),
  
  addAddress: (address: Omit<UserAddressDto, 'id' | 'createdDate' | 'modifiedDate'>) => 
    api.post('/user/profile/addresses', address),
  
  updateAddress: (addressId: number, address: Partial<UserAddressDto>) => 
    api.put(`/user/profile/addresses/${addressId}`, address),
  
  deleteAddress: (addressId: number) => 
    api.delete(`/user/profile/addresses/${addressId}`),
  
  setDefaultAddress: (addressId: number) => 
    api.put(`/user/profile/addresses/${addressId}/default`),
  
  // Favorites
  getFavorites: (page: number = 0, size: number = 10) => 
    api.get(`/user/profile/favorites?page=${page}&size=${size}`),
  
  addToFavorites: (productId: number) => 
    api.post(`/user/profile/favorites/${productId}`),
  
  removeFromFavorites: (productId: number) => 
    api.delete(`/user/profile/favorites/${productId}`),
  
  checkFavorite: (productId: number) => 
    api.get(`/user/profile/favorites/${productId}/check`),
}; 