"use client";

import crypto from 'crypto';

/**
 * Lấy secret key từ biến môi trường
 * - Ưu tiên APP_SECRET_KEY, sau đó SECRET_KEY, cuối cùng là fallback mặc định
 * @returns string - secret key
 */
const getSecretKey = (): string => {
  return process.env.APP_SECRET_KEY || process.env.SECRET_KEY || '793ddabd7c83070cd1ac72877edd9d29';
};

/**
 * Tạo checksum SHA256 với secret key (dùng cho xác thực)
 * @param providerUserId - tên đăng nhập (email/số điện thoại)
 * @param password - mật khẩu
 * @returns Chuỗi hash SHA256
 */
export const generateChecksum = (providerUserId: string, password: string): string => {
  const secretKey = getSecretKey();
  const data = `${providerUserId}${password}${secretKey}`;
  // console.log('🔍 [SECRET KEY] Secret Key:', secretKey);
  // console.log('🔍 [CHECKSUM] Data:', data);
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Tạo checksum đơn giản (không có secret key, dùng cho test)
 * @param providerUserId - tên đăng nhập
 * @param password - mật khẩu
 * @returns Chuỗi hash SHA256
 */
export const generateSimpleChecksum = (providerUserId: string, password: string): string => {
  const data = `${providerUserId}${password}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Kiểm tra định dạng email hợp lệ
 * @param email - email cần kiểm tra
 * @returns true nếu hợp lệ, false nếu sai định dạng
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra định dạng số điện thoại Việt Nam hợp lệ
 * @param phone - số điện thoại cần kiểm tra
 * @returns true nếu hợp lệ, false nếu sai định dạng
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
};

/**
 * Kiểm tra mật khẩu đủ mạnh (>= 6 ký tự)
 * @param password - mật khẩu
 * @returns true nếu hợp lệ, false nếu yếu
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Chuẩn hóa số điện thoại về dạng 0xxxxxxxxx
 * @param phone - số điện thoại
 * @returns số điện thoại chuẩn hóa
 */
export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  // Nếu bắt đầu bằng 84, chuyển thành 0
  if (cleaned.startsWith('84')) {
    return '0' + cleaned.substring(2);
  }
  return cleaned;
};

/**
 * Lưu accessToken và refreshToken vào localStorage
 * @param accessToken
 * @param refreshToken
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Xóa accessToken và refreshToken khỏi localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Kiểm tra user đã đăng nhập chưa (có accessToken)
 * @returns true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

/**
 * Lấy thông tin user từ accessToken (giải mã payload JWT)
 * @returns object payload hoặc null nếu lỗi
 */
export const getUserInfo = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Tự động nhận diện loại tài khoản (email/phone)
 * @param input - chuỗi nhập vào
 * @returns 'EMAIL' | 'PHONE'
 */
export const detectProvider = (input: string): 'EMAIL' | 'PHONE' => {
  if (validateEmail(input)) return 'EMAIL';
  if (validatePhone(input)) return 'PHONE';
  return 'PHONE'; // Mặc định là phone
}; 