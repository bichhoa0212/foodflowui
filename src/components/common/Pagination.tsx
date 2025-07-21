import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  size: number;
  total: number;
  setPage: (v: number) => void;
}

/**
 * Component phân trang tái sử dụng
 */
const Pagination: React.FC<PaginationProps> = ({ page, size, total, setPage }) => {
  const pageCount = Math.ceil(total / size);
  if (pageCount <= 1) return null;
  return (
    <div className={styles.pagination}>
      {Array.from({ length: pageCount }).map((_, i) => (
        <button
          key={i}
          className={i === page ? styles.active : ''}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination; 