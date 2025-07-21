"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserInfo, saveTokens, clearTokens } from '@/lib/utils';
import { authAPI, AuthRequest, AuthResponse } from '@/lib/authApi';

// Kiểu dữ liệu thông tin user
interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

// Kiểu dữ liệu context
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
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra authentication status khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      if (authStatus) {
        const user = getUserInfo();
        if (user) setUserInfo(user);
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    };
    checkAuth();
    // Lắng nghe sự thay đổi token trong localStorage
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
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // ms
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        // Refresh token 5 phút trước khi hết hạn
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            authAPI.refreshToken({ refreshToken })
              .then(response => {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                saveTokens(accessToken, newRefreshToken);
                setUserInfo(getUserInfo());
              })
              .catch(() => {
                logout();
              });
          }
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    };
    // Kiểm tra mỗi phút
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    checkTokenExpiry(); // Kiểm tra ngay khi mount
    return () => clearInterval(interval);
  }, [authenticated]);

  /**
   * Đăng nhập, lưu token, cập nhật state
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
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng xuất, xóa token, reset state
   */
  const logout = () => {
    clearTokens();
    setAuthenticated(false);
    setUserInfo(null);
    router.push('/login');
  };

  /**
   * Làm mới trạng thái xác thực (dùng khi token thay đổi ngoài ý muốn)
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