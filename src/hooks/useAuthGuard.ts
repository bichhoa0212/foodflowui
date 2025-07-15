"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = '/login', requireAuth = true } = options;
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !authenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && authenticated) {
        // Nếu không yêu cầu auth nhưng user đã đăng nhập, redirect về trang chủ
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