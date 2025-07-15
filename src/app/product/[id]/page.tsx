"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productAPI } from "@/lib/productApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Box, Container, Typography, CircularProgress, Card, CardContent, Chip, Stack } from "@mui/material";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    productAPI.getProductDetail(Number(id))
      .then(res => {
        if (!res.data.data) {
          setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
        } else {
          setProduct(res.data.data);
        }
      })
      .catch(() => setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ProtectedRoute>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7f7f7' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 6 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ mt: 6 }}>{error}</Typography>
          ) : product ? (
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 2, boxShadow: 3 }}>
              <Box sx={{ flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 2, md: 0 } }}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxWidth: 350, maxHeight: 350, objectFit: 'cover', borderRadius: 8, background: '#fff' }} />
              </Box>
              <CardContent sx={{ flex: 2 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>{product.name}</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip label={product.status === 1 ? "Còn hàng" : "Hết hàng"} color={product.status === 1 ? "success" : "default"} />
                  <Chip label={`ID: ${product.id}`} variant="outlined" />
                </Stack>
                <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>{product.price?.toLocaleString()} đ</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </Container>
        <Footer />
      </Box>
    </ProtectedRoute>
  );
} 