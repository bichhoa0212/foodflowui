"use client";

import React from 'react';
import styles from './ReviewItem.module.css';
import { Card, CardContent, Typography, Stack, Chip, Button, Box } from '@mui/material';

interface ReviewItemProps {
  review: any;
  isEditing: boolean;
  editForm: { rating: number; comment: string };
  setEditForm: (f: any) => void;
  onEditClick: () => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  editSubmitting: boolean;
  onDelete: () => void;
  canEdit: boolean;
}

/**
 * Item hiển thị 1 review
 * - Nhận prop review, trạng thái edit, các action
 * - Style tách riêng qua CSS module
 */
const ReviewItem: React.FC<ReviewItemProps> = ({
  review, isEditing, editForm, setEditForm, onEditClick, onEditSubmit, onCancelEdit, editSubmitting, onDelete, canEdit
}) => {
  return (
    <Card className={styles.card}>
      <CardContent>
        {isEditing ? (
          <Box component="form" onSubmit={onEditSubmit} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Typography fontWeight={700}>{review.userName}</Typography>
              <select value={editForm.rating} onChange={e => setEditForm((f: any) => ({ ...f, rating: Number(e.target.value) }))} style={{ fontSize: 16, padding: 4 }}>
                {[1,2,3,4,5].map(star => <option key={star} value={star}>{star}</option>)}
              </select>
              <Typography variant="body2" color="text.secondary">{new Date(review.createdDate).toLocaleString()}</Typography>
            </Stack>
            <textarea
              value={editForm.comment}
              onChange={e => setEditForm((f: any) => ({ ...f, comment: e.target.value }))}
              rows={3}
              className={styles.textarea}
              required
            />
            <Button type="submit" variant="contained" disabled={editSubmitting} sx={{ mr: 1 }}>
              {editSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button variant="outlined" onClick={onCancelEdit}>Hủy</Button>
          </Box>
        ) : (
          <>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontWeight={700}>{review.userName}</Typography>
              <Chip label={`⭐ ${review.rating}`} color="warning" size="small" />
              <Typography variant="body2" color="text.secondary">{new Date(review.createdDate).toLocaleString()}</Typography>
            </Stack>
            <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
            {canEdit && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button size="small" variant="outlined" onClick={onEditClick}>Sửa</Button>
                <Button size="small" variant="outlined" color="error" onClick={onDelete}>Xóa</Button>
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewItem; 