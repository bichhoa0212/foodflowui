"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook để bảo vệ các component cần authentication
 * - Tự động kiểm tra token trước khi render
 * - Redirect về login nếu chưa đăng nhập hoặc token hết hạn
 * - Có thể dùng cho các trang protected
 */
export const useAuthGuard = (redirectTo: string = '/login') => {
  const { authenticated, loading, checkTokenExpiry } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!authenticated) {
          // Nếu chưa đăng nhập, redirect
          window.location.href = redirectTo;
          return;
        }

        // Kiểm tra token có hợp lệ không
        const isValid = await checkTokenExpiry();
        if (!isValid) {
          // Token không hợp lệ, sẽ tự động redirect trong checkTokenExpiry
          return;
        }
      }
    };

    checkAuth();
  }, [authenticated, loading, checkTokenExpiry, redirectTo]);

  return { authenticated, loading };
};

/**
 * Hook để kiểm tra token trước khi gửi API request
 * - Tự động refresh token nếu cần
 * - Trả về true nếu có thể gửi request, false nếu cần đăng nhập lại
 */
export const useTokenCheck = () => {
  const { checkTokenExpiry } = useAuth();

  const ensureValidToken = async (): Promise<boolean> => {
    return await checkTokenExpiry();
  };

  return { ensureValidToken };
}; 