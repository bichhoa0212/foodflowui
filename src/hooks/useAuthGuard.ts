"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Kiểu option cho useAuthGuard
 * - redirectTo: đường dẫn chuyển hướng nếu không đủ quyền
 * - requireAuth: true: chỉ cho phép user đã đăng nhập, false: chỉ cho phép user chưa đăng nhập
 */
interface UseAuthGuardOptions {
  redirectTo?: string; // Đường dẫn chuyển hướng nếu không đủ quyền
  requireAuth?: boolean; // true: chỉ cho phép user đã đăng nhập, false: chỉ cho phép user chưa đăng nhập
}

/**
 * Custom hook bảo vệ route, tự động redirect nếu không đủ quyền
 * @param options - redirectTo: trang chuyển hướng, requireAuth: true/false
 * - Nếu requireAuth=true: chỉ cho phép user đã đăng nhập, nếu chưa sẽ chuyển hướng
 * - Nếu requireAuth=false: chỉ cho phép user chưa đăng nhập, nếu đã đăng nhập sẽ chuyển về trang chủ
 * - Trả về authenticated, loading, isAuthorized để component có thể kiểm tra
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = '/login', requireAuth = true } = options;
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !authenticated) {
        // Nếu yêu cầu đăng nhập mà user chưa đăng nhập, chuyển hướng
        router.push(redirectTo);
      } else if (!requireAuth && authenticated) {
        // Nếu không yêu cầu đăng nhập nhưng user đã đăng nhập, chuyển về trang chủ
        router.push('/');
      }
    }
  }, [authenticated, loading, requireAuth, redirectTo, router]);

  return {
    authenticated,
    loading,
    isAuthorized: requireAuth ? authenticated : !authenticated,
  };
}; 