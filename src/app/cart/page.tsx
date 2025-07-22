"use client";
import React, { useState } from "react";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/authApi';
import { Box, Container, Typography, Card, CardContent, Button, TextField, Stack, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Trang giỏ hàng
 * - Hiển thị danh sách sản phẩm trong giỏ
 * - Cho phép cập nhật số lượng, xóa sản phẩm
 * - Đặt hàng nhiều sản phẩm cùng lúc
 */
export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { authenticated } = useAuth();
  const [orderForm, setOrderForm] = useState({ deliveryAddress: '', contactPhone: '', notes: '' });
  const [ordering, setOrdering] = useState(false);

  // Xử lý submit đặt hàng
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng trống!');
    setOrdering(true);
    try {
      await authAPI.orderProducts({
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
        ...orderForm
      });
      alert('Đặt hàng thành công!');
      clearCart();
      setOrderForm({ deliveryAddress: '', contactPhone: '', notes: '' });
    } catch (err) {
      alert('Đặt hàng thất bại.');
    } finally {
      setOrdering(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>Giỏ hàng</Typography>
        {/* Hiển thị danh sách sản phẩm trong giỏ */}
        {cart.length === 0 ? (
          <Typography>Giỏ hàng của bạn đang trống.</Typography>
        ) : (
          <>
            {cart.map(item => (
              <Card key={item.productId} sx={{ mb: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>{item.name}</Typography>
                    <Typography color="primary">{item.price.toLocaleString()} đ</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <Typography>Số lượng:</Typography>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={e => updateQuantity(item.productId, Number(e.target.value))}
                        inputProps={{ min: 1, style: { width: 60 } }}
                      />
                    </Stack>
                  </Box>
                  <IconButton onClick={() => removeFromCart(item.productId)} color="error"><DeleteIcon /></IconButton>
                </CardContent>
              </Card>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>Tổng tiền: {total.toLocaleString()} đ</Typography>
            {/* Thông tin giao hàng và đặt hàng */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Thông tin giao hàng</Typography>
            {authenticated ? (
              <Box component="form" onSubmit={handleOrderSubmit} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafafa' }}>
                <Stack spacing={2}>
                  <TextField
                    label="Địa chỉ giao hàng"
                    value={orderForm.deliveryAddress}
                    onChange={e => setOrderForm(f => ({ ...f, deliveryAddress: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Số điện thoại liên hệ"
                    value={orderForm.contactPhone}
                    onChange={e => setOrderForm(f => ({ ...f, contactPhone: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Ghi chú"
                    value={orderForm.notes}
                    onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                    multiline
                    rows={2}
                  />
                  <Button type="submit" variant="contained" disabled={ordering}>
                    {ordering ? 'Đang đặt hàng...' : 'Đặt hàng'}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography color="text.secondary">Vui lòng đăng nhập để đặt hàng.</Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
} 