"use client";

import React from 'react';
import styles from './ProductCard.module.css';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Rating,
  Button,
  Skeleton
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Star,
  Visibility
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToFavorite?: (product: Product) => void;
  showActions?: boolean;
  loading?: boolean;
}

/**
 * Card hiển thị thông tin sản phẩm
 * - Nhận prop product với đầy đủ thông tin
 * - Hỗ trợ add to cart và favorite
 * - Hiển thị rating và review count
 * - Xử lý click chuyển trang chi tiết
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onAddToFavorite, 
  showActions = true,
  loading = false 
}) => {
  const router = useRouter();
  const { authenticated } = useAuth();

  const handleCardClick = (e: React.MouseEvent) => {
    // Không chuyển trang nếu click vào button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (authenticated) {
      router.push(`/product/${product.id}`);
    } else {
      router.push(`/login?redirect=/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToFavorite?.(product);
  };

  if (loading) {
    return (
      <Card className={styles.card}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent className={styles.content}>
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="60%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <img 
          src={product.imageUrl || '/placeholder-product.jpg'} 
          alt={product.name} 
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
        
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <Chip
            label="Hết hàng"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}

        {/* Quick Actions */}
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: 0,
              transition: 'opacity 0.2s',
              '.MuiCard-root:hover &': {
                opacity: 1,
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              onClick={handleAddToFavorite}
            >
              <FavoriteBorder fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <CardContent className={styles.content}>
        {/* Category */}
        {product.categoryName && (
          <Chip
            label={product.categoryName}
            size="small"
            variant="outlined"
            sx={{ mb: 1, fontSize: '0.75rem' }}
          />
        )}

        {/* Product Name */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            height: '2.4em'
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        {product.rating !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.reviewCount || 0})
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Typography 
          variant="body2" 
          className={styles.desc}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            height: '2.8em',
            mb: 2
          }}
        >
          {product.description}
        </Typography>

        {/* Price */}
        <Typography 
          color="primary" 
          fontWeight="bold" 
          variant="h6"
          sx={{ mb: 2 }}
        >
          {product.price?.toLocaleString()} đ
        </Typography>

        {/* Stock Info */}
        {product.stock > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Còn {product.stock} sản phẩm
          </Typography>
        )}

        {/* Action Buttons */}
        {showActions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              sx={{ flex: 1 }}
            >
              {product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
            <IconButton
              size="small"
              onClick={handleAddToFavorite}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <FavoriteBorder fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard; 