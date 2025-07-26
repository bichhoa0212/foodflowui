import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './ProductSlider.module.css';

interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  purchaseCount?: number;
  reviewCount?: number;
  discountType?: string;
  discountValue?: number;
}

interface ProductSliderProps {
  products: Product[];
  loading: boolean;
  title: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, loading, title }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const getCurrentProducts = () => {
    const startIndex = currentPage * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box className={styles.sliderContainer}>
        <Typography variant="h4" component="h2" gutterBottom className={styles.sliderTitle}>
          {title}
        </Typography>
        <Box className={styles.loadingContainer}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box className={styles.sliderContainer}>
        <Typography variant="h4" component="h2" gutterBottom className={styles.sliderTitle}>
          {title}
        </Typography>
        <Box className={styles.emptyContainer}>
          <Typography>Không có sản phẩm nào</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.sliderContainer}>
      <Typography variant="h4" component="h2" gutterBottom className={styles.sliderTitle}>
        {title}
      </Typography>
      
      <Box className={styles.sliderContent}>
        <IconButton
          className={styles.navButton}
          onClick={handlePrevPage}
          disabled={totalPages <= 1}
        >
          <ChevronLeft />
        </IconButton>

        <Box className={styles.productsContainer}>
          <Grid container spacing={2}>
            {getCurrentProducts().map((product) => (
              <Grid item xs={12} sm={6} md={2.4} key={product.id}>
                <Card 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl || '/placeholder-product.jpg'}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <CardContent className={styles.productContent}>
                    <Typography variant="h6" component="h3" className={styles.productName}>
                      {product.name}
                    </Typography>
                    
                    {product.discountType && product.discountValue && (
                      <Box className={styles.discountContainer}>
                        <Typography variant="body2" className={styles.originalPrice}>
                          {formatPrice(product.price)}
                        </Typography>
                        <Chip
                          label={`Giảm ${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : 'đ'}`}
                          color="error"
                          size="small"
                          className={styles.discountChip}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="h6" color="primary" className={styles.productPrice}>
                      {formatPrice(product.price)}
                    </Typography>
                    
                    <Box className={styles.productStats}>
                      <Typography variant="caption" color="text.secondary">
                        Đã bán: {product.purchaseCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Đánh giá: {product.reviewCount || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <IconButton
          className={styles.navButton}
          onClick={handleNextPage}
          disabled={totalPages <= 1}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {totalPages > 1 && (
        <Box className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Box
              key={index}
              className={`${styles.paginationDot} ${index === currentPage ? styles.activeDot : ''}`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductSlider; 