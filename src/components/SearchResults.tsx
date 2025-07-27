import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
} from '@mui/material';
import { Home, Search, ShoppingCart, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './SearchResults.module.css';

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

interface SearchResultsProps {
  products: Product[];
  searchTerm: string;
  loading: boolean;
  onBackToHome: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  products, 
  searchTerm, 
  loading, 
  onBackToHome 
}) => {
  const router = useRouter();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Ngăn không cho click vào card
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      quantity: 1
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.loadingContainer}>
          <Typography variant="h6">Đang tìm kiếm...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      {/* Breadcrumbs */}
      <Breadcrumbs className={styles.breadcrumbs}>
        <Link
          component="button"
          variant="body1"
          onClick={onBackToHome}
          className={styles.breadcrumbLink}
        >
          <Home sx={{ fontSize: 16, mr: 0.5 }} />
          Trang chủ
        </Link>
        <Typography color="text.primary">
          <Search sx={{ fontSize: 16, mr: 0.5 }} />
          Kết quả tìm kiếm
        </Typography>
      </Breadcrumbs>

      {/* Search Results Header */}
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Kết quả tìm kiếm
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Tìm thấy <strong>{products.length}</strong> sản phẩm cho "{searchTerm}"
        </Typography>
      </Box>

      {/* Results */}
      {products.length === 0 ? (
        <Box className={styles.emptyContainer}>
          <Search sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thử tìm kiếm với từ khóa khác hoặc quay về trang chủ
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    
                    {product.description && (
                      <Typography variant="body2" color="text.secondary" className={styles.productDescription}>
                        {product.description}
                      </Typography>
                    )}
                    
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
                    
                    <Box className={styles.productActions}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add />}
                        onClick={(e) => handleAddToCart(e, product)}
                        className={styles.addToCartButton}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Box>
                  </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults; 