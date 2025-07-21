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
 */
interface AuthContextType {
  authenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  login: (data: AuthRequest) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => void;
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

  // Kiểm tra authentication status khi component mount
  useEffect(() => {
    /**
     * Kiểm tra trạng thái xác thực:
     * - Nếu có accessToken: set authenticated, lấy userInfo từ token
     * - Nếu không: reset userInfo
     * - Luôn set loading = false sau khi kiểm tra
     */
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      if (authStatus) {
        const user = getUserInfo();
        if (user) setUserInfo(user); // Lấy thông tin user từ JWT
      } else {
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

  // Tự động refresh token khi sắp hết hạn
  useEffect(() => {
    if (!authenticated) return;
    /**
     * Kiểm tra thời gian hết hạn của accessToken:
     * - Nếu còn <5 phút sẽ tự động gọi API refresh token
     * - Nếu refresh lỗi sẽ logout
     * - Kiểm tra mỗi phút (interval)
     */
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT
        const expiryTime = payload.exp * 1000; // ms
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        // Nếu sắp hết hạn (<5 phút) thì refresh
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            authAPI.refreshToken({ refreshToken })
              .then(response => {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                saveTokens(accessToken, newRefreshToken); // Lưu token mới
                setUserInfo(getUserInfo()); // Cập nhật userInfo
              })
              .catch(() => {
                logout(); // Nếu lỗi thì logout
              });
          }
        }
      } catch (error) {
        // Nếu token lỗi format
        console.error('Error parsing token:', error);
      }
    };
    // Kiểm tra mỗi phút
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    checkTokenExpiry(); // Kiểm tra ngay khi mount
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
  const refreshAuth = () => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    if (authStatus) {
      const user = getUserInfo();
      setUserInfo(user);
    } else {
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 