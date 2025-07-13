import crypto from 'crypto';

// Lấy secret key từ environment
const getSecretKey = (): string => {
  return process.env.APP_SECRET_KEY || process.env.SECRET_KEY || '793ddabd7c83070cd1ac72877edd9d29';
};

// Hàm tạo checksum SHA256 với secret key
export const generateChecksum = (providerUserId: string, password: string): string => {
  const secretKey = getSecretKey();
  const data = `${providerUserId}${password}${secretKey}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Hàm tạo checksum đơn giản (không có secret key) - để tương thích với backend
export const generateSimpleChecksum = (providerUserId: string, password: string): string => {
  const data = `${providerUserId}${password}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Hàm validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hàm validate phone number (Vietnam format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
};

// Hàm validate password
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Hàm format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Nếu bắt đầu bằng 84, chuyển thành 0
  if (cleaned.startsWith('84')) {
    return '0' + cleaned.substring(2);
  }
  
  return cleaned;
};

// Hàm lưu token vào localStorage
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Hàm xóa token khỏi localStorage
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Hàm kiểm tra user đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Hàm lấy thông tin user từ token
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