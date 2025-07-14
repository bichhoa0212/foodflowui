import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

interface ProductFilterBarProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: () => void;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  search,
  setSearch,
  onSearch,
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <TextField
          label="Tên sản phẩm"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nhập tên sản phẩm..."
          fullWidth
          size="small"
          onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Loại sản phẩm</InputLabel>
          <Select
            value={selectedCategory}
            label="Loại sản phẩm"
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={sort}
            label="Sắp xếp"
            onChange={e => setSort(e.target.value)}
          >
            <MenuItem value="price_asc">Giá tăng dần</MenuItem>
            <MenuItem value="price_desc">Giá giảm dần</MenuItem>
            <MenuItem value="name_asc">Tên A-Z</MenuItem>
            <MenuItem value="name_desc">Tên Z-A</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={1.5}>
        <TextField
          label="Giá từ"
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={6} md={1.5}>
        <TextField
          label="Đến"
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
    </Grid>
  );
};

export default ProductFilterBar; 