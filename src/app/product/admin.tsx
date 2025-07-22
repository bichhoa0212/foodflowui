"use client";
import React, { useState } from "react";
import ProductCard from '@/components/product/ProductCard';
import { Box, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';

// Mock data sản phẩm
const initialProducts = [
  { id: 1, name: "Sản phẩm 1", price: 100000, description: "Mô tả sản phẩm 1", image: "", stock: 10 },
  { id: 2, name: "Sản phẩm 2", price: 200000, description: "Mô tả sản phẩm 2", image: "", stock: 5 },
];

export default function AdminProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number|null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "", stock: "" });

  const handleOpenAdd = () => {
    setEditIndex(null);
    setForm({ name: "", price: "", description: "", image: "", stock: "" });
    setOpen(true);
  };
  const handleOpenEdit = (idx: number) => {
    const p = products[idx];
    setEditIndex(idx);
    setForm({ name: p.name, price: String(p.price), description: p.description, image: p.image, stock: String(p.stock) });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (editIndex === null) {
      setProducts([...products, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock) }]);
    } else {
      const newProducts = [...products];
      newProducts[editIndex] = { ...newProducts[editIndex], ...form, price: Number(form.price), stock: Number(form.stock) };
      setProducts(newProducts);
    }
    setOpen(false);
  };
  const handleDelete = (idx: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((_, i) => i !== idx));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>Thêm sản phẩm</Button>
      </Box>
      <Grid container spacing={2}>
        {products.map((product, idx) => (
          <Grid item xs={12} md={4} key={product.id}>
            <ProductCard product={product} />
            <Box mt={1} display="flex" gap={1}>
              <Button variant="outlined" size="small" onClick={() => handleOpenEdit(idx)}>Sửa</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(idx)}>Xóa</Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex === null ? "Thêm sản phẩm" : "Sửa sản phẩm"}</DialogTitle>
        <DialogContent>
          <TextField label="Tên sản phẩm" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Giá" name="price" value={form.price} onChange={handleChange} fullWidth margin="normal" type="number" />
          <TextField label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Tồn kho" name="stock" value={form.stock} onChange={handleChange} fullWidth margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 