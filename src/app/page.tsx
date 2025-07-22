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
import { useRouter } from 'next/navigation';
import ProductFilterBar from '@/components/ProductFilterBar';
import ProductList from '@/components/ProductList';
import { publicAPI } from '@/lib/publicApi';
import styles from './HomePage.module.css';

/**
 * Trang chủ FlowMarket
 * - Hero section, features, top sản phẩm, filter, list
 */
const HomePage = () => {
  const router = useRouter();
  // State filter và dữ liệu
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
  const [topReviewedProducts, setTopReviewedProducts] = useState<any[]>([]);
  // Đã loại bỏ các state liên quan đến nhà hàng

  // Lấy dữ liệu top và categories khi mount
  useEffect(() => {
    publicAPI.getCategories({ page: 0, size: 50 })
      .then(res => setCategories(res.data.data.data || res.data.data.content || []));
    // Đã loại bỏ các API gọi nhà hàng
  }, []);

  // Lấy danh sách sản phẩm theo filter
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

  // Các tính năng nổi bật
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
    <>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom className={styles.heroTitle}>
                Chào mừng đến với FlowMarket
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom className={styles.heroSubtitle}>
                Siêu thị cá nhân - Mua sắm sản phẩm dễ dàng
              </Typography>
              <Typography variant="body1" paragraph className={styles.heroDesc}>
                Khám phá hàng trăm sản phẩm chất lượng từ siêu thị cá nhân FlowMarket và nhận giao hàng tận nơi nhanh chóng.
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  size="large"
                  className={styles.heroButton}
                  onClick={() => router.push('/register')}
                >
                  Bắt đầu ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className={`${styles.heroButton} ${styles.heroButtonOutlined}`}
                  onClick={() => router.push('/login')}
                >
                  Đăng nhập
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={styles.heroImage}>
                <Restaurant sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Features Section */}
      <Container maxWidth="lg" className={styles.featuresSection}>
        <Typography variant="h3" component="h2" gutterBottom className={styles.featuresTitle}>
          Tại sao chọn FlowMarket?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card className={styles.featureCard}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box className={styles.featureIcon}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" className={styles.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className={styles.featureDesc}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions className={styles.cardActions}>
                  <Button size="small" color="primary">
                    Tìm hiểu thêm
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Top sản phẩm nổi bật */}
      <Container maxWidth="lg" className={styles.topSection}>
        <Typography variant="h4" component="h2" gutterBottom className={styles.topTitle}>Top 10 sản phẩm bán chạy nhất</Typography>
        <ProductList products={topProducts} loading={false} page={0} size={10} total={topProducts.length} setPage={() => {}} hidePagination />
      </Container>
      <Container maxWidth="lg" className={styles.topSection}>
        <Typography variant="h4" component="h2" gutterBottom className={styles.topTitle}>Top 10 sản phẩm được đánh giá nhiều nhất</Typography>
        <ProductList products={topReviewedProducts} loading={false} page={0} size={10} total={topReviewedProducts.length} setPage={() => {}} hidePagination />
      </Container>
      {/* Filter + Product List Section */}
      <Container maxWidth="lg" className={styles.filterSection}>
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
    </>
  );
};

export default HomePage;
