"use client";

import React from 'react';
import styles from './ProductCard.module.css';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: any;
}

/**
 * Card hiển thị thông tin sản phẩm
 * - Nhận prop product
 * - Xử lý click chuyển trang chi tiết (nếu đã đăng nhập)
 * - Style tách riêng qua CSS module
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { authenticated } = useAuth();
  const handleClick = () => {
    if (authenticated) {
      router.push(`/product/${product.id}`);
    } else {
      router.push(`/login?redirect=/product/${product.id}`);
    }
  };
  return (
    <Card className={styles.card} onClick={handleClick}>
      <img src={product.imageUrl} alt={product.name} className={styles.image} />
      <CardContent className={styles.content}>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" className={styles.desc}>{product.description}</Typography>
        <Typography color="primary" fontWeight="bold">{product.price?.toLocaleString()} đ</Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 