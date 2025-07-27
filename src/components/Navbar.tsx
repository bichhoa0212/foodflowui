import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import { getCategories } from '../lib/productApi';

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(0, 50);
        if (response.data && response.data.content) {
          setCategories(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuList}>
        <li className={styles.categoryContainer}>
          <button 
            className={styles.categoryButton}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <MenuIcon className={styles.menuIcon} />
            Danh Mục Sản Phẩm
          </button>
          {showDropdown && (
            <div 
              className={styles.dropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {loading ? (
                <div className={styles.loading}>Đang tải...</div>
              ) : (
                <ul className={styles.categoryList}>
                  {categories.map((category) => (
                    <li key={category.id} className={styles.categoryItem}>
                      <a href={`/product?category=${category.id}`} className={styles.categoryLink}>
                        {category.imageUrl && (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className={styles.categoryImage}
                          />
                        )}
                        <span>{category.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </li>
        <li className={styles.menuItem}>Giỏ quà tặng</li>
        <li className={styles.menuItem}>Về FlowMart</li>
        <li className={styles.menuItem}>Tin tức</li>
        <li className={styles.menuItem}>Liên hệ</li>
      </ul>
    </nav>
  );
};

export default Navbar; 