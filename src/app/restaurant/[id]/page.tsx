"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { restaurantAPI } from '@/lib/restaurantApi';
import { authAPI } from '@/lib/authApi';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box, Container, Typography, CircularProgress, Stack, Grid, Button } from "@mui/material";
import ProductList from '@/components/ProductList';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import ReviewItem from '@/components/review/ReviewItem';

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

  // Lấy review
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

  // Xử lý submit review
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
  // Xử lý edit review
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
  // Xử lý xóa review
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
        {/* Loading/Error */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 6 }}>{error}</Typography>
        ) : restaurant ? (
          <>
            {/* Thông tin nhà hàng */}
            <RestaurantCard restaurant={restaurant} />
            <Typography variant="h5" sx={{ mb: 2 }}>Danh sách món ăn của nhà hàng</Typography>
            <ProductList products={products} loading={false} page={0} size={products.length} total={products.length} setPage={() => {}} hidePagination />
            {/* Review section */}
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
            {/* Form gửi review */}
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
            {/* Danh sách review */}
            {reviews.length === 0 ? (
              <Typography>Chưa có đánh giá nào.</Typography>
            ) : (
              <Box>
                {reviews.map((review: any) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    isEditing={editingReviewId === review.id}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onEditClick={() => handleEditClick(review)}
                    onEditSubmit={handleEditSubmit}
                    onCancelEdit={() => setEditingReviewId(null)}
                    editSubmitting={editSubmitting}
                    onDelete={() => handleDelete(review.id)}
                    canEdit={authenticated && userInfo?.name === review.userName}
                  />
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