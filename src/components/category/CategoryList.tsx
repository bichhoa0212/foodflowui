"use client";

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Alert,
  Skeleton,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import CategoryCard from './CategoryCard';
import { categoryAPI, Category } from '@/lib/category';

interface CategoryListProps {
  onCategoryClick?: (category: Category) => void;
  showDescription?: boolean;
  showImage?: boolean;
  itemsPerPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  title?: string;
}

/**
 * Component hiển thị danh sách danh mục
 * - Hỗ trợ search và pagination
 * - Loading states và error handling
 * - Responsive grid layout
 */
const CategoryList: React.FC<CategoryListProps> = ({
  onCategoryClick,
  showDescription = true,
  showImage = true,
  itemsPerPage = 12,
  showSearch = true,
  showPagination = true,
  title = "Danh mục sản phẩm",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoryAPI.getAllCategories();
        const allCategories = response.data.data || [];
        
        // Filter by search term
        const filteredCategories = searchTerm
          ? allCategories.filter((cat: Category) => 
              cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
          : allCategories;
        
        setCategories(filteredCategories);
        setTotalPages(Math.ceil(filteredCategories.length / itemsPerPage));
        setCurrentPage(1);
      } catch (err: any) {
        console.error('Error loading categories:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [searchTerm, itemsPerPage]);

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  };

  // Loading skeleton
  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <CategoryCard
            category={{} as Category}
            loading={true}
            showDescription={showDescription}
            showImage={showImage}
          />
        </Grid>
      ))}
    </Grid>
  );

  // Empty state
  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Không tìm thấy danh mục
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {searchTerm ? 'Hãy thử thay đổi từ khóa tìm kiếm' : 'Không có danh mục nào'}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {/* Title */}
      {title && (
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {title}
        </Typography>
      )}

      {/* Search */}
      {showSearch && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Categories Grid */}
      {loading ? (
        renderSkeletons()
      ) : categories.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {getCurrentPageItems().map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
                  onClick={handleCategoryClick}
                  showDescription={showDescription}
                  showImage={showImage}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        renderEmptyState()
      )}

      {/* Results Info */}
      {!loading && categories.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {getCurrentPageItems().length} trong tổng số {categories.length} danh mục
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CategoryList; 