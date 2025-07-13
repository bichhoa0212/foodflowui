'use client';

import React, { useEffect } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginForm from '@/components/auth/LoginForm';
import { isAuthenticated } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu user đã đăng nhập thì redirect về trang chủ
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleSwitchToRegister = () => {
    router.push('/auth');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                FoodFlow
              </Typography>
              <Typography variant="body1">
                Đăng nhập để tiếp tục
              </Typography>
            </Box>

            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
              © 2024 FoodFlow. Tất cả quyền được bảo lưu.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage; 