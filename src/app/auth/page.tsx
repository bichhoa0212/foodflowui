'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

// TabPanel cho giao diện tab
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

/**
 * Trang đăng nhập/đăng ký dạng tab
 * - Tự động redirect nếu đã đăng nhập
 * - Hiển thị loading khi kiểm tra trạng thái
 */
const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (!loading && authenticated) {
      router.push('/');
    }
  }, [authenticated, loading, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleLoginSuccess = () => { router.push('/'); };
  const handleRegisterSuccess = () => { router.push('/'); };
  const handleSwitchToRegister = () => { setTabValue(1); };
  const handleSwitchToLogin = () => { setTabValue(0); };

  // Hiển thị loading khi kiểm tra authentication
  if (loading) {
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
          }}
        >
          <Typography variant="h6" color="white">
            Đang kiểm tra...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

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
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{ borderRadius: 2, overflow: 'hidden' }}
          >
            {/* Tabs đăng nhập/đăng ký */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="auth tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2,
                  },
                }}
              >
                <Tab label="Đăng nhập" {...a11yProps(0)} />
                <Tab label="Đăng ký" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            </TabPanel>
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

export default AuthPage; 