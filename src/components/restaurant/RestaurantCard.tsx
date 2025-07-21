"use client";

import React from 'react';
import styles from './RestaurantCard.module.css';
import { Card, CardContent, Typography, Chip, Stack, Grid } from '@mui/material';

interface RestaurantCardProps {
  restaurant: any;
}

/**
 * Card hiển thị thông tin nhà hàng
 * - Nhận prop restaurant
 * - Style tách riêng qua CSS module
 */
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Card className={styles.card}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <img src={restaurant.logoUrl || restaurant.coverImageUrl} alt={restaurant.name} className={styles.image} />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} gutterBottom>{restaurant.name}</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip label={`ID: ${restaurant.id}`} variant="outlined" />
              <Chip label={restaurant.status === 1 ? "Mở cửa" : restaurant.status === 2 ? "Đóng cửa" : "Tạm đóng"} color={restaurant.status === 1 ? "success" : "default"} />
            </Stack>
            <Typography variant="body1" sx={{ mb: 2 }}>{restaurant.description}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Địa chỉ:</b> {restaurant.address}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Số điện thoại:</b> {restaurant.phoneNumber}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Lượt mua:</b> {restaurant.purchaseCount}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Lượt đánh giá:</b> {restaurant.reviewCount}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Rating:</b> {restaurant.rating}</Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RestaurantCard; 