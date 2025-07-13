'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Restaurant,
  DeliveryDining,
  ShoppingCart,
  Person,
  ExitToApp,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserInfo, clearTokens } from '@/lib/utils';

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

const HomePage = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        setUserInfo(getUserInfo());
      }
    };

    checkAuth();
    // Kiểm tra lại khi window focus
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearTokens();
    setAuthenticated(false);
    setUserInfo(null);
    handleMenuClose();
    router.push('/login');
  };

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: 'Nhà hàng đa dạng',
      description: 'Khám phá hàng nghìn nhà hàng với menu phong phú từ ẩm thực Việt Nam đến quốc tế.',
    },
    {
      icon: <DeliveryDining sx={{ fontSize: 40 }} />,
      title: 'Giao hàng nhanh chóng',
      description: 'Đặt hàng và nhận món ăn tại nhà trong thời gian ngắn nhất với đội ngũ giao hàng chuyên nghiệp.',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: 'Đặt hàng dễ dàng',
      description: 'Giao diện thân thiện, đặt hàng chỉ với vài cú click chuột.',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Restaurant sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FoodFlow
            </Typography>
            
            {authenticated ? (
              <>
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Person sx={{ mr: 1 }} />
                    {userInfo?.name || 'User'}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  onClick={() => router.push('/login')}
                >
                  Đăng nhập
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonAdd />}
                  onClick={() => router.push('/register')}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" gutterBottom>
                  Chào mừng đến với FoodFlow
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  Nền tảng đặt đồ ăn trực tuyến hàng đầu Việt Nam
                </Typography>
                <Typography variant="body1" paragraph>
                  Khám phá hàng nghìn món ăn ngon từ các nhà hàng uy tín và nhận giao hàng tận nơi trong thời gian ngắn nhất.
                </Typography>
                {!authenticated && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ mr: 2, mb: 2 }}
                      onClick={() => router.push('/register')}
                    >
                      Bắt đầu ngay
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ color: 'white', borderColor: 'white', mb: 2 }}
                      onClick={() => router.push('/login')}
                    >
                      Đăng nhập
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 300,
                  }}
                >
                  <Restaurant sx={{ fontSize: 200, opacity: 0.3 }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Tại sao chọn FoodFlow?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button size="small" color="primary">
                      Tìm hiểu thêm
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: 'grey.900',
            color: 'white',
            py: 6,
            mt: 'auto',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  FoodFlow
                </Typography>
                <Typography variant="body2">
                  Nền tảng đặt đồ ăn trực tuyến hàng đầu Việt Nam, kết nối người dùng với hàng nghìn nhà hàng uy tín.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Liên kết
                </Typography>
                <Typography variant="body2" component="div">
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                        Về chúng tôi
                      </Button>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                        Điều khoản sử dụng
                      </Button>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                        Chính sách bảo mật
                      </Button>
                    </Box>
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Liên hệ
                </Typography>
                <Typography variant="body2">
                  Email: support@foodflow.com<br />
                  Hotline: 1900-xxxx<br />
                  Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 3, mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="grey.400">
                © 2024 FoodFlow. Tất cả quyền được bảo lưu.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
