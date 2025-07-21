"use client";

import React from 'react';
import styles from './ProductFilterBar.module.css';

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

/**
 * Thanh lọc sản phẩm (filter bar)
 * - Lọc theo tên, loại, giá, sắp xếp
 * - Gọi onSearch khi nhấn Enter ở ô tìm kiếm
 */
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
    <div className={styles.filterBar}>
      {/* Tìm kiếm theo tên sản phẩm */}
      <div className={styles.gridItem}>
        <input
          className={styles.input}
          type="text"
          placeholder="Tên sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
        />
      </div>
      {/* Lọc theo loại sản phẩm */}
      <div className={styles.gridItem}>
        <select
          className={styles.select}
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {/* Sắp xếp */}
      <div className={styles.gridItem}>
        <select
          className={styles.select}
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="name_asc">Tên A-Z</option>
          <option value="name_desc">Tên Z-A</option>
        </select>
      </div>
      {/* Lọc theo giá */}
      <div className={styles.gridItem}>
        <input
          className={styles.input}
          type="number"
          placeholder="Giá từ"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
      </div>
      <div className={styles.gridItem}>
        <input
          className={styles.input}
          type="number"
          placeholder="Đến"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductFilterBar; 