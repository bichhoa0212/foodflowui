"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { restaurantAPI } from '@/lib/restaurantApi';
import { authAPI } from '@/lib/authApi';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box, Container, Typography, CircularProgress, Card, CardContent, Chip, Stack, Grid, Button } from "@mui/material";
import ProductList from '@/components/ProductList';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const { authenticated, userInfo } = useAuth();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewSize] = useState(5);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewFilterRating, setReviewFilterRating] = useState<number | undefined>(undefined);
  const [reviewSort, setReviewSort] = useState<'asc' | 'desc'>('desc');

  const fetchReviews = async (page = 0, rating = reviewFilterRating, sort = reviewSort) => {
    const res = await restaurantAPI.getReviewsByRestaurant(Number(id), page, reviewSize, rating, sort);
    setReviews(res.data.data.reviews || []);
    setReviewTotal(res.data.data.total || 0);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    Promise.all([
      restaurantAPI.getRestaurantDetail(Number(id)),
      restaurantAPI.getProductsByRestaurant(Number(id)),
      restaurantAPI.getReviewsByRestaurant(Number(id), reviewPage, reviewSize, reviewFilterRating, reviewSort),
    ])
      .then(([resDetail, resProducts, resReviews]) => {
        if (!resDetail.data.data) {
          setError("Không tìm thấy nhà hàng hoặc có lỗi xảy ra.");
        } else {
          setRestaurant(resDetail.data.data);
          setProducts(resProducts.data.data || []);
          setReviews(resReviews.data.data.reviews || []);
          setReviewTotal(resReviews.data.data.total || 0);
        }
      })
      .catch(() => setError("Không tìm thấy nhà hàng hoặc có lỗi xảy ra."))
      .finally(() => setLoading(false));
  }, [id, reviewPage, reviewSize, reviewFilterRating, reviewSort]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      await authAPI.postReviewRestaurant(Number(id), reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setReviewPage(0);
      await fetchReviews(0);
    } catch (err) {
      alert('Gửi đánh giá thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (review: any) => {
    setEditingReviewId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReviewId) return;
    setEditSubmitting(true);
    try {
      await authAPI.updateReviewRestaurant(editingReviewId, editForm);
      setEditingReviewId(null);
      await fetchReviews(reviewPage);
    } catch (err) {
      alert('Cập nhật đánh giá thất bại.');
    } finally {
      setEditSubmitting(false);
    }
  };
  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await authAPI.deleteReviewRestaurant(reviewId);
      await fetchReviews(reviewPage);
    } catch (err) {
      alert('Xóa đánh giá thất bại.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 6 }}>{error}</Typography>
        ) : restaurant ? (
          <>
            <Card sx={{ p: 2, boxShadow: 3, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <img src={restaurant.logoUrl || restaurant.coverImageUrl} alt={restaurant.name} style={{ width: '100%', maxWidth: 250, maxHeight: 250, objectFit: 'cover', borderRadius: 8, background: '#fff' }} />
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
            <Typography variant="h5" sx={{ mb: 2 }}>Danh sách món ăn của nhà hàng</Typography>
            <ProductList products={products} loading={false} page={0} size={products.length} total={products.length} setPage={() => {}} hidePagination />
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Đánh giá của khách hàng ({reviewTotal})</Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Typography>Lọc theo số sao:</Typography>
              <select value={reviewFilterRating ?? ''} onChange={e => { setReviewPage(0); setReviewFilterRating(e.target.value ? Number(e.target.value) : undefined); }} style={{ fontSize: 16, padding: 4 }}>
                <option value="">Tất cả</option>
                {[5,4,3,2,1].map(star => <option key={star} value={star}>{star} sao</option>)}
              </select>
              <Typography>Sắp xếp:</Typography>
              <select value={reviewSort} onChange={e => { setReviewPage(0); setReviewSort(e.target.value as 'asc' | 'desc'); }} style={{ fontSize: 16, padding: 4 }}>
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </Stack>
            {authenticated && (
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafafa' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Gửi đánh giá của bạn:</Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Typography>Số sao:</Typography>
                  <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))} style={{ fontSize: 16, padding: 4 }}>
                    {[1,2,3,4,5].map(star => <option key={star} value={star}>{star}</option>)}
                  </select>
                </Stack>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', fontSize: 16, padding: 8, marginBottom: 8 }}
                  placeholder="Nhập bình luận của bạn..."
                  required
                />
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </Box>
            )}
            {reviews.length === 0 ? (
              <Typography>Chưa có đánh giá nào.</Typography>
            ) : (
              <Box>
                {reviews.map((review: any) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      {editingReviewId === review.id ? (
                        <Box component="form" onSubmit={handleEditSubmit} sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Typography fontWeight={700}>{review.userName}</Typography>
                            <select value={editForm.rating} onChange={e => setEditForm(f => ({ ...f, rating: Number(e.target.value) }))} style={{ fontSize: 16, padding: 4 }}>
                              {[1,2,3,4,5].map(star => <option key={star} value={star}>{star}</option>)}
                            </select>
                            <Typography variant="body2" color="text.secondary">{new Date(review.createdDate).toLocaleString()}</Typography>
                          </Stack>
                          <textarea
                            value={editForm.comment}
                            onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                            rows={3}
                            style={{ width: '100%', fontSize: 16, padding: 8, marginBottom: 8 }}
                            required
                          />
                          <Button type="submit" variant="contained" disabled={editSubmitting} sx={{ mr: 1 }}>
                            {editSubmitting ? 'Đang lưu...' : 'Lưu'}
                          </Button>
                          <Button variant="outlined" onClick={() => setEditingReviewId(null)}>Hủy</Button>
                        </Box>
                      ) : (
                        <>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography fontWeight={700}>{review.userName}</Typography>
                            <Chip label={`⭐ ${review.rating}`} color="warning" size="small" />
                            <Typography variant="body2" color="text.secondary">{new Date(review.createdDate).toLocaleString()}</Typography>
                          </Stack>
                          <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
                          {authenticated && userInfo?.name === review.userName && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Button size="small" variant="outlined" onClick={() => handleEditClick(review)}>Sửa</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(review.id)}>Xóa</Button>
                            </Stack>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                  {Array.from({ length: Math.ceil(reviewTotal / reviewSize) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={i === reviewPage ? 'contained' : 'outlined'}
                      onClick={() => setReviewPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}
          </>
        ) : null}
      </Container>
      <Footer />
    </Box>
  );
} 