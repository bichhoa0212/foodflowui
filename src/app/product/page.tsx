"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Skeleton,
  Alert,
  Button,
  InputAdornment,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Search, FilterList, Sort, ShoppingCart, Favorite } from '@mui/icons-material';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/lib/productApi';
import { categoryAPI, Category } from '@/lib/category';
import ApiTest from '@/components/common/ApiTest';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}



interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const ProductListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: currentPage - 1, // API sử dụng 0-based indexing
          size: 12,
          categoryId: selectedCategory || undefined,
          name: searchTerm || undefined,
          sort: sortBy,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        };

        const response = await productAPI.getProducts(params);
        const data: ProductResponse = response.data;
        
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product);
  };

  // Handle add to favorite
  const handleAddToFavorite = (product: Product) => {
    // TODO: Implement add to favorite functionality
    console.log('Add to favorite:', product);
  };

  // Get current category name
  const currentCategory = categories.find(cat => cat.id.toString() === selectedCategory);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* API Test Component */}
      <ApiTest />
      
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" color="inherit" underline="hover">
          Trang chủ
        </Link>
        <Link href="/product" color="inherit" underline="hover">
          Sản phẩm
        </Link>
        {currentCategory && (
          <Typography color="text.primary">{currentCategory.name}</Typography>
        )}
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {currentCategory ? currentCategory.name : 'Tất cả sản phẩm'}
        </Typography>
        {currentCategory?.description && (
          <Typography variant="body1" color="text.secondary">
            {currentCategory.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Hiển thị {products.length} trong tổng số {totalElements} sản phẩm
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
                Bộ lọc
              </Typography>

              {/* Search */}
              <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm sản phẩm..."
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
              </Box>

              {/* Category Filter */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  label="Danh mục"
                >
                  <MenuItem value="">Tất cả danh mục</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleFilterChange();
                  }}
                  label="Sắp xếp"
                >
                  <MenuItem value="name,asc">Tên A-Z</MenuItem>
                  <MenuItem value="name,desc">Tên Z-A</MenuItem>
                  <MenuItem value="price,asc">Giá tăng dần</MenuItem>
                  <MenuItem value="price,desc">Giá giảm dần</MenuItem>
                  <MenuItem value="rating,desc">Đánh giá cao nhất</MenuItem>
                  <MenuItem value="reviewCount,desc">Nhiều đánh giá nhất</MenuItem>
                </Select>
              </FormControl>

              {/* Price Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Khoảng giá
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      placeholder="Từ"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      type="number"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      placeholder="Đến"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      type="number"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Clear Filters */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  setSortBy('name');
                  setMinPrice('');
                  setMaxPrice('');
                  setCurrentPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Products Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard 
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onAddToFavorite={() => handleAddToFavorite(product)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy sản phẩm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductListPage; 