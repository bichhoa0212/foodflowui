"use client";

import React from 'react';
import { Grid, CircularProgress } from '@mui/material';
import ProductCard from './product/ProductCard';
import Pagination from './common/Pagination';

interface ProductListProps {
  products: any[];
  loading: boolean;
  page: number;
  size: number;
  total: number;
  setPage: (v: number) => void;
  hidePagination?: boolean;
}

/**
 * Danh sách sản phẩm với phân trang
 * - Hiển thị danh sách sản phẩm dạng lưới
 * - Tự động chuyển trang, phân trang
 * - Chỉ cho phép xem chi tiết nếu đã đăng nhập
 */
const ProductList: React.FC<ProductListProps> = ({ products, loading, page, size, total, setPage, hidePagination }) => {
  if (loading) return <CircularProgress />;
  return (
    <>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      {!hidePagination && (
        <Pagination page={page} size={size} total={total} setPage={setPage} />
      )}
    </>
  );
};

export default ProductList; 