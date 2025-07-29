"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import CategoryList from '@/components/category/CategoryList';
import { Category } from '@/lib/category';

/**
 * Trang hiển thị danh sách tất cả danh mục sản phẩm
 * - Hiển thị grid các danh mục
 * - Hỗ trợ search và pagination
 * - Click vào danh mục để xem sản phẩm
 */
const CategoryPage: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (category: Category) => {
    // Chuyển đến trang sản phẩm với filter theo danh mục
    router.push(`/product?category=${category.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" color="inherit" underline="hover">
          Trang chủ
        </Link>
        <Typography color="text.primary">Danh mục sản phẩm</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Danh mục sản phẩm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Khám phá các danh mục sản phẩm đa dạng của chúng tôi
        </Typography>
      </Box>

      {/* Category List */}
      <CategoryList
        onCategoryClick={handleCategoryClick}
        showDescription={true}
        showImage={true}
        itemsPerPage={12}
        showSearch={true}
        showPagination={true}
        title=""
      />
    </Container>
  );
};

export default CategoryPage; 