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
import ProductSlider from '@/components/ProductSlider';
import FeaturesSection from '@/components/FeaturesSection';
import { publicAPI } from '@/lib/publicApi';
import styles from './HomePage.module.css';
import ImageSlider from '@/components/ImageSlider';
import PromoCodeSlider from '@/components/PromoCodeSlider';

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
  const [topDiscountedProducts, setTopDiscountedProducts] = useState<any[]>([]);
  const [topProductsLoading, setTopProductsLoading] = useState(false);
  const [topReviewedProductsLoading, setTopReviewedProductsLoading] = useState(false);
  const [topDiscountedProductsLoading, setTopDiscountedProductsLoading] = useState(false);
  const [topNewestProducts, setTopNewestProducts] = useState<any[]>([]);
  const [topNewestProductsLoading, setTopNewestProductsLoading] = useState(false);
  // Đã loại bỏ các state liên quan đến nhà hàng

  // Lấy dữ liệu top và categories khi mount
  useEffect(() => {
    publicAPI.getCategories({ page: 0, size: 50 })
      .then(res => setCategories(res.data.data.data || res.data.data.content || []));
    
    // Lấy top 10 sản phẩm bán chạy
    setTopProductsLoading(true);
    publicAPI.getTopSellingProducts()
      .then((res: any) => {
        console.log('Top selling products response:', res);
        if (res.data && res.data.data) {
          setTopProducts(res.data.data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching top selling products:', error);
      })
      .finally(() => {
        setTopProductsLoading(false);
      });
    
    // Lấy top 10 sản phẩm được đánh giá nhiều nhất
    setTopReviewedProductsLoading(true);
    publicAPI.getTopReviewedProducts()
      .then((res: any) => {
        console.log('Top reviewed products response:', res);
        if (res.data && res.data.data) {
          setTopReviewedProducts(res.data.data);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching top reviewed products:', error);
      })
      .finally(() => {
        setTopReviewedProductsLoading(false);
      });

    // Lấy top 10 sản phẩm có khuyến mãi
    setTopDiscountedProductsLoading(true);
    publicAPI.getTopDiscountedProducts()
      .then((res: any) => {
        console.log('Top discounted products response:', res);
        if (res.data && res.data.data) {
          setTopDiscountedProducts(res.data.data);
        }
      })
      .finally(() => {
        setTopDiscountedProductsLoading(false); 
      });

    // Lấy top 10 sản phẩm mới nhất
    setTopNewestProductsLoading(true);
    publicAPI.getTopNewestProducts()
      .then((res: any) => {
        console.log('Top newest products response:', res);
        if (res.data && res.data.data) {
          setTopNewestProducts(res.data.data);
        }
      })
      .finally(() => {
        setTopNewestProductsLoading(false);
      });
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
        {/* Banner 13 năm */}
        {/* <Box style={{ background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0' }}>
        <img src="https://theme.hstatic.net/1000282430/1001088848/14/slideshow_2.jpg?v=1558" alt="13th Anniversary" style={{ maxWidth: '100%', borderRadius: 18, boxShadow: '0 2px 16px rgba(23,100,67,0.08)' }} />
        </Box> */}
        <ImageSlider />
      <PromoCodeSlider />
      {/* Hero Section */}

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

      {/* Top sản phẩm mới nhất */}
      <Container maxWidth="lg">
        <ProductSlider 
          products={topNewestProducts} 
          loading={topNewestProductsLoading} 
          title="Top 10 sản phẩm mới nhất" 
        />
      </Container>
        {/* Top sản phẩm có khuyến mãi */}
        <Container maxWidth="lg">
        <ProductSlider 
          products={topDiscountedProducts} 
          loading={topDiscountedProductsLoading} 
          title="Top 10 sản phẩm có khuyến mãi" 
        />
      </Container>
      {/* Top sản phẩm nổi bật */}
      <Container maxWidth="lg">
        <ProductSlider 
          products={topProducts} 
          loading={topProductsLoading} 
          title="Top 10 sản phẩm bán chạy nhất" 
        />
      </Container>
    
      
      {/* Features Section */}
      <FeaturesSection />
      
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
