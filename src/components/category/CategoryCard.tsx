"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
} from '@mui/material';
import { Category } from '@/lib/category';

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
  loading?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
}

/**
 * Component hiển thị thông tin danh mục
 * - Hỗ trợ click để chuyển trang
 * - Hiển thị hình ảnh và mô tả tùy chọn
 * - Loading state với skeleton
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  loading = false,
  showDescription = true,
  showImage = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  if (loading) {
    return (
      <Card 
        sx={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          }
        }}
      >
        <CardContent>
          <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={16} width="60%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: onClick ? 'translateY(-2px)' : 'none',
          boxShadow: onClick ? 3 : 1,
        }
      }}
    >
      <CardContent>
        {/* Category Image */}
        {showImage && category.imageUrl && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={category.imageUrl}
              alt={category.name}
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 8,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-category.jpg';
              }}
            />
          </Box>
        )}

        {/* Category Name */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            textAlign: showImage ? 'center' : 'left'
          }}
        >
          {category.name}
        </Typography>

        {/* Category Description */}
        {showDescription && category.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              textAlign: showImage ? 'center' : 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              height: '2.8em',
              mb: 1
            }}
          >
            {category.description}
          </Typography>
        )}

        {/* Category ID Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            label={`ID: ${category.id}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryCard; 