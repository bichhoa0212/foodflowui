import React from 'react';
import styles from './Navbar.module.css';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuList}>
        <li>
          <button className={styles.categoryButton}>
            <MenuIcon className={styles.menuIcon} />
            Danh Mục Sản Phẩm
          </button>
        </li>
        <li className={styles.menuItem}>Giỏ quà tặng</li>
        <li className={styles.menuItem}>Về Nam An</li>
        <li className={styles.menuItem}>Tin tức</li>
        <li className={styles.menuItem}>Liên hệ</li>
      </ul>
    </nav>
  );
};

export default Navbar; 