"use client";

import React from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProductListProps {
  products: any[];
  loading: boolean;
  page: number;
  size: number;
  total: number;
  setPage: (v: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, page, size, total, setPage }) => {
  const router = useRouter();
  const { authenticated } = useAuth();
  
  const handleCardClick = (id: number) => {
    if (authenticated) {
      router.push(`/product/${id}`);
    } else {
      router.push(`/login?redirect=/product/${id}`);
    }
  };
  
  if (loading) return <CircularProgress />;
  
  return (
    <>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} md={4} key={product.id}>
            <Card sx={{ height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => handleCardClick(product.id)}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'center' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" sx={{ minHeight: 40 }}>{product.description}</Typography>
                <Typography color="primary" fontWeight="bold">{product.price?.toLocaleString()} đ</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {Array.from({ length: Math.ceil(total / size) }).map((_, i) => (
          <Button
            key={i}
            variant={i === page ? 'contained' : 'outlined'}
            onClick={() => setPage(i)}
            sx={{ mx: 0.5 }}
          >
            {i + 1}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default ProductList; 