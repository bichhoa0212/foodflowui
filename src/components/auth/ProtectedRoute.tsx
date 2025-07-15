"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, loading, router]);

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return fallback || (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Đang kiểm tra đăng nhập...
        </Typography>
      </Box>
    );
  }

  // Nếu chưa đăng nhập, không hiển thị gì (sẽ redirect)
  if (!authenticated) {
    return null;
  }

  // Nếu đã đăng nhập, hiển thị children
  return <>{children}</>;
};

export default ProtectedRoute; 