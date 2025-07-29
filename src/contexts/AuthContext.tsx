"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserInfo, saveTokens, clearTokens } from '@/lib/utils';
import { authAPI, AuthRequest, AuthResponse } from '@/lib/authApi';

/**
 * Kiểu dữ liệu thông tin user
 * - id: mã người dùng
 * - name: tên
 * - email: email
 * - phone: số điện thoại
 * - roles: danh sách vai trò
 * - permissions: danh sách quyền
 */
interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

/**
 * Kiểu dữ liệu context xác thực
 * - authenticated: đã đăng nhập hay chưa
 * - userInfo: thông tin user (nếu có)
 * - loading: trạng thái loading
 * - login: hàm đăng nhập
 * - logout: hàm đăng xuất
 * - refreshAuth: làm mới trạng thái xác thực
 * - checkTokenExpiry: kiểm tra token có sắp hết hạn không
 */
interface AuthContextType {
  authenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  login: (data: AuthRequest) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => void;
  checkTokenExpiry: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook sử dụng AuthContext
 * Đảm bảo chỉ dùng trong AuthProvider, nếu không sẽ throw lỗi.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider quản lý trạng thái xác thực toàn cục
 * - Lưu trạng thái đăng nhập, thông tin user, loading
 * - Tự động kiểm tra token, refresh token, đồng bộ localStorage
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false); // Trạng thái đã đăng nhập
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Thông tin user
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const router = useRouter();

  /**
   * Kiểm tra token có sắp hết hạn không và tự động refresh nếu cần
   * @returns Promise<boolean> - true nếu token còn hợp lệ, false nếu đã logout
   */
  const checkTokenExpiry = async (): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAuthenticated(false);
      setUserInfo(null);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT
      const expiryTime = payload.exp * 1000; // ms
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // Nếu token đã hết hạn
      if (timeUntilExpiry <= 0) {
        console.log('Token đã hết hạn, thử refresh...');
        return await refreshToken();
      }

      // Nếu sắp hết hạn (<5 phút) thì refresh
      if (timeUntilExpiry < 5 * 60 * 1000) {
        console.log('Token sắp hết hạn, thử refresh...');
        return await refreshToken();
      }

      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      return await refreshToken();
    }
  };

  /**
   * Refresh token
   * @returns Promise<boolean> - true nếu refresh thành công, false nếu lỗi
   */
  const refreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await authAPI.refreshToken({ refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      saveTokens(accessToken, newRefreshToken);
      
      // Cập nhật userInfo từ token mới
      const user = getUserInfo();
      if (user) {
        setUserInfo(user);
        setAuthenticated(true);
      }
      
      console.log('Refresh token thành công');
      return true;
    } catch (error) {
      console.error('Refresh token thất bại:', error);
      logout();
      return false;
    }
  };

  // Kiểm tra authentication status khi component mount
  useEffect(() => {
    /**
     * Kiểm tra trạng thái xác thực:
     * - Nếu có accessToken: kiểm tra hết hạn và refresh nếu cần
     * - Nếu không: reset userInfo
     * - Luôn set loading = false sau khi kiểm tra
     */
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      if (authStatus) {
        const isValid = await checkTokenExpiry();
        if (!isValid) {
          setAuthenticated(false);
          setUserInfo(null);
        } else {
          const user = getUserInfo();
          if (user) setUserInfo(user);
          setAuthenticated(true);
        }
      } else {
        setAuthenticated(false);
        setUserInfo(null);
      }
      setLoading(false);
    };
    
    checkAuth();
    
    // Lắng nghe sự thay đổi token trong localStorage (đa tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Tự động kiểm tra token mỗi phút
  useEffect(() => {
    if (!authenticated) return;
    
    const interval = setInterval(async () => {
      await checkTokenExpiry();
    }, 60 * 1000); // Kiểm tra mỗi phút
    
    return () => clearInterval(interval);
  }, [authenticated]);

  /**
   * Đăng nhập:
   * - Gọi API, lưu token, cập nhật state
   * - Trả về true nếu thành công, false nếu lỗi
   * - Xử lý loading trong quá trình login
   */
  const login = async (data: AuthRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      const { accessToken, refreshToken, userInfo: user } = response.data;
      saveTokens(accessToken, refreshToken);
      setAuthenticated(true);
      setUserInfo(user);
      return true;
    } catch (error) {
      // Có thể show message cho user ở đây nếu muốn
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng xuất:
   * - Xóa token khỏi localStorage
   * - Reset state
   * - Chuyển hướng về trang login
   */
  const logout = () => {
    clearTokens();
    setAuthenticated(false);
    setUserInfo(null);
    router.push('/login');
  };

  /**
   * Làm mới trạng thái xác thực:
   * - Dùng khi token thay đổi ngoài ý muốn (ví dụ: đổi tab, đổi token thủ công)
   */
  const refreshAuth = async () => {
    const authStatus = isAuthenticated();
    if (authStatus) {
      const isValid = await checkTokenExpiry();
      if (!isValid) {
        setAuthenticated(false);
        setUserInfo(null);
      } else {
        const user = getUserInfo();
        setUserInfo(user);
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
      setUserInfo(null);
    }
  };

  // Giá trị context cung cấp cho toàn app
  const value: AuthContextType = {
    authenticated,
    userInfo,
    loading,
    login,
    logout,
    refreshAuth,
    checkTokenExpiry,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 