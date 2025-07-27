"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import SearchSuggestions from './SearchSuggestions';
import { publicAPI } from '@/lib/publicApi';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  
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

  // Gợi ý tìm kiếm
  const popularSuggestions = [
    'Dầu ăn Neptune',
    'Nước rửa chén Sunlight',
    'Gạo ST25',
    'Sữa tươi Vinamilk',
    'Bánh mì',
    'Rau củ quả',
    'Thịt heo',
    'Cá hồi'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      // Lọc gợi ý dựa trên input
      const filteredSuggestions = popularSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowSuggestions(false);
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <AppBar position="static" className={styles.appbar} elevation={0}>
      <Toolbar className={styles.toolbar}>
        {/* Logo bên trái */}
        <Box 
          className={styles.headerLogo}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          {/* <img src="/logo.svg" alt="FlowMarket" style={{ height: 40, marginRight: 8 }} /> */}
          <span className={styles.headerLogoText}>FlowMart</span>
        </Box>
        {/* Ô tìm kiếm ở giữa */}
        <Box className={styles.searchBoxWrapper} ref={searchBoxRef}>
          <Box className={styles.searchBox}>
            <Search className={styles.icon} style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Bạn cần tìm sản phẩm gì?"
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              onFocus={() => {
                if (searchValue.trim()) {
                  setShowSuggestions(true);
                }
              }}
              className={styles.searchInput}
            />
            <Button onClick={handleSearch} className={styles.searchButton}>Tìm</Button>
          </Box>
          <SearchSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            visible={showSuggestions}
          />
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