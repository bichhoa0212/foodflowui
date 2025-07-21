"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string; // Đường dẫn chuyển hướng nếu không đủ quyền
  requireAuth?: boolean; // true: chỉ cho phép user đã đăng nhập, false: chỉ cho phép user chưa đăng nhập
}

/**
 * Custom hook bảo vệ route, tự động redirect nếu không đủ quyền
 * @param options - redirectTo: trang chuyển hướng, requireAuth: true/false
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