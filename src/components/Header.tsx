"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Box,
} from '@mui/material';
import {
  Restaurant,
  Person,
  ExitToApp,
  Login,
  PersonAdd,
  ShoppingCart,
  Favorite,
  Search,
  HeadsetMic,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

/**
 * Header cố định cho toàn bộ app
 * - Hiển thị tên app, menu user, nút đăng nhập/đăng ký
 * - Tự động hiển thị thông tin user nếu đã đăng nhập
 */
const Header: React.FC = () => {
  const { authenticated, userInfo, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  // Giả lập số lượng yêu thích và giỏ hàng
  const favoriteCount = 0; // TODO: lấy từ context/store
  const cartCount = 1; // TODO: lấy từ context/store

  // Mở menu user
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // Đóng menu user
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // Đăng xuất
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <AppBar position="static" className={styles.appbar} elevation={0}>
      <Toolbar className={styles.toolbar}>
        {/* Logo bên trái */}
        <Box className={styles.headerLogo}>
          {/* <img src="/logo.svg" alt="FlowMarket" style={{ height: 40, marginRight: 8 }} /> */}
          <span className={styles.headerLogoText}>FlowMarket</span>
        </Box>
        {/* Ô tìm kiếm ở giữa */}
        <Box className={styles.searchBoxWrapper}>
          <Box className={styles.searchBox}>
            <Search className={styles.icon} style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Bạn cần tìm sản phẩm gì?"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              className={styles.searchInput}
            />
            <Button onClick={handleSearch} className={styles.searchButton}>Tìm</Button>
          </Box>
        </Box>
        {/* Hotline & icon bên phải */}
        <Box className={styles.headerRight}>
          <Box className={styles.hotline}>
            <HeadsetMic className={styles.icon} style={{ fontSize: 28, marginRight: 8 }} />
            <Box>
              <div className={styles.hotlineText}>Hotline Support</div>
              <div className={styles.hotlineNumber}>0912.456.789</div>
            </Box>
          </Box>
          <IconButton className={styles.iconCircle} onClick={() => authenticated ? router.push('/profile') : router.push('/login')}>
            <Person className={styles.icon} />
          </IconButton>
          <Badge badgeContent={favoriteCount} color="warning" overlap="circular" className={styles.badge}>
            <IconButton className={`${styles.iconCircle} ${styles.iconCircleFavorite}`} onClick={() => authenticated ? router.push('/favorite') : router.push('/login')}>
              <Favorite className={styles.icon} />
            </IconButton>
          </Badge>
          <Badge badgeContent={cartCount} color="warning" overlap="circular" className={styles.badge}>
            <IconButton className={`${styles.iconCircle} ${styles.iconCircleCart}`} onClick={() => authenticated ? router.push('/cart') : router.push('/login')}>
              <ShoppingCart className={styles.icon} />
            </IconButton>
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 