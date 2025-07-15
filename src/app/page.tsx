'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Restaurant,
  DeliveryDining,
  ShoppingCart,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/navigation';
import ProductFilterBar from '@/components/ProductFilterBar';
import ProductList from '@/components/ProductList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { productAPI } from '@/lib/productApi';
import { restaurantAPI } from '@/lib/restaurantApi';
import {publicAPI} from "@/lib/publicApi";

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
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('price_asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [topReviewedProducts, setTopReviewedProducts] = useState<any[]>([]);
  const [topReviewedRestaurants, setTopReviewedRestaurants] = useState<any[]>([]);

  useEffect(() => {
    publicAPI.getCategories({ page: 0, size: 50 })
      .then(res => setCategories(res.data.data.data || res.data.data.content || []));
    productAPI.getTopPurchasedProducts().then(res => setTopProducts(res.data.data || []));
    restaurantAPI.getTopPurchasedRestaurants().then(res => setTopRestaurants(res.data.data || []));
    productAPI.getTopReviewedProducts().then(res => setTopReviewedProducts(res.data.data || []));
    restaurantAPI.getTopReviewedRestaurants().then(res => setTopReviewedRestaurants(res.data.data || []));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    publicAPI.getProducts({
      page,
      size,
      categoryId: selectedCategory,
      sort,
      minPrice,
      maxPrice,
      name: search,
    })
      .then(res => {
        const d = res.data.data;
        setProducts(d.data || []);
        setTotal(d.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [selectedCategory, sort, minPrice, maxPrice, page, size, search]);

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
        <Header />
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

        {/* Top 10 sản phẩm hot nhất */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Top 10 món ăn hot nhất</Typography>
          <ProductList products={topProducts} loading={false} page={0} size={10} total={topProducts.length} setPage={() => {}} hidePagination />
        </Container>
        {/* Top 10 nhà hàng hot nhất */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Top 10 nhà hàng hot nhất</Typography>
          <Grid container spacing={2}>
            {topRestaurants.map((restaurant: any) => (
              <Grid item xs={12} md={4} key={restaurant.id}>
                <Card sx={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => router.push(`/restaurant/${restaurant.id}`)}>
                  <CardContent>
                    <Typography variant="h6">{restaurant.name}</Typography>
                    <Typography variant="body2" sx={{ minHeight: 40 }}>{restaurant.description}</Typography>
                    <Typography color="primary" fontWeight="bold">Lượt mua: {restaurant.purchaseCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Top 10 sản phẩm được đánh giá nhiều nhất */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Top 10 món ăn được đánh giá nhiều nhất</Typography>
          <ProductList products={topReviewedProducts} loading={false} page={0} size={10} total={topReviewedProducts.length} setPage={() => {}} hidePagination />
        </Container>
        {/* Top 10 nhà hàng được đánh giá nhiều nhất */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Top 10 nhà hàng được đánh giá nhiều nhất</Typography>
          <Grid container spacing={2}>
            {topReviewedRestaurants.map((restaurant: any) => (
              <Grid item xs={12} md={4} key={restaurant.id}>
                <Card sx={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => router.push(`/restaurant/${restaurant.id}`)}>
                  <CardContent>
                    <Typography variant="h6">{restaurant.name}</Typography>
                    <Typography variant="body2" sx={{ minHeight: 40 }}>{restaurant.description}</Typography>
                    <Typography color="primary" fontWeight="bold">Lượt đánh giá: {restaurant.reviewCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Filter + Product List Section */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <ProductFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sort={sort}
            setSort={setSort}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            search={search}
            setSearch={setSearch}
            onSearch={() => { setPage(0); fetchProducts(); }}
          />
          <Box sx={{ mt: 4 }}>
            <ProductList
              products={products}
              loading={loading}
              page={page}
              size={size}
              total={total}
              setPage={setPage}
            />
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
