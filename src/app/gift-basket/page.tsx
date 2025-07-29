"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Add,
  Remove,
  LocalShipping,
  Security,
  Refresh,
  Star,
} from '@mui/icons-material';

interface GiftProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

const mockGiftProducts: GiftProduct[] = [
  {
    id: 1,
    name: "Hộp Quà Tết Cao Cấp",
    description: "Hộp quà tết truyền thống với các món ăn đặc trưng Việt Nam",
    price: 299000,
    originalPrice: 399000,
    image: "/images/gift-box-1.jpg",
    rating: 4.8,
    reviewCount: 156,
    category: "Tết",
    tags: ["Cao cấp", "Truyền thống"],
    inStock: true,
  },
  {
    id: 2,
    name: "Giỏ Quà Sinh Nhật",
    description: "Giỏ quà sinh nhật với bánh kem và hoa tươi",
    price: 199000,
    originalPrice: 250000,
    image: "/images/gift-box-2.jpg",
    rating: 4.6,
    reviewCount: 89,
    category: "Sinh nhật",
    tags: ["Bánh kem", "Hoa tươi"],
    inStock: true,
  },
  {
    id: 3,
    name: "Hộp Quà Doanh Nghiệp",
    description: "Quà tặng doanh nghiệp chuyên nghiệp, sang trọng",
    price: 599000,
    originalPrice: 750000,
    image: "/images/gift-box-3.jpg",
    rating: 4.9,
    reviewCount: 234,
    category: "Doanh nghiệp",
    tags: ["Chuyên nghiệp", "Sang trọng"],
    inStock: true,
  },
  {
    id: 4,
    name: "Giỏ Quà Sức Khỏe",
    description: "Giỏ quà sức khỏe với các sản phẩm dinh dưỡng",
    price: 399000,
    originalPrice: 450000,
    image: "/images/gift-box-4.jpg",
    rating: 4.7,
    reviewCount: 123,
    category: "Sức khỏe",
    tags: ["Dinh dưỡng", "Tốt cho sức khỏe"],
    inStock: false,
  },
];

const GiftBasketPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const categories = ['Tất cả', 'Tết', 'Sinh nhật', 'Doanh nghiệp', 'Sức khỏe'];

  const filteredProducts = mockGiftProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    setSnackbarMessage('Đã thêm vào giỏ hàng!');
    setShowSnackbar(true);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🎁 Giỏ Quà Tặng
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Chọn những món quà ý nghĩa cho người thân yêu
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm giỏ quà..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease-in-out'
              }
            }}>
              {/* Discount Badge */}
              {product.originalPrice > product.price && (
                <Chip
                  label={`-${getDiscountPercentage(product.originalPrice, product.price)}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    fontWeight: 'bold'
                  }}
                />
              )}

              {/* Favorite Button */}
              <IconButton
                onClick={() => handleToggleFavorite(product.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                {favorites.includes(product.id) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              {/* Product Image */}
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Product Info */}
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {product.description}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.reviewCount})
                  </Typography>
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                  {product.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>

                {/* Price */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(product.price)}
                  </Typography>
                  {product.originalPrice > product.price && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(product.originalPrice)}
                    </Typography>
                  )}
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.inStock}
                  sx={{ mt: 'auto' }}
                >
                  {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box sx={{ mt: 6, py: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Tại sao chọn giỏ quà của chúng tôi?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Giao hàng nhanh chóng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giao hàng trong vòng 2-4 giờ tại TP.HCM và Hà Nội
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chất lượng đảm bảo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sản phẩm tươi mới, đóng gói cẩn thận, đảm bảo vệ sinh
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Refresh sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Đổi trả dễ dàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chính sách đổi trả trong 24h nếu không hài lòng
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GiftBasketPage; 