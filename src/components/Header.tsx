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
} from '@mui/icons-material';
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

  return (
    <AppBar position="static" className={styles.appbar}>
      <Toolbar className={styles.toolbar}>
        <span className={styles.logo}><Restaurant /></span>
        <Typography variant="h6" component="div" className={styles.flexGrow}>
          FoodFlow
        </Typography>
        {authenticated ? (
          <div className={styles.userMenu}>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              className={styles.menuButton}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <Person />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Person sx={{ mr: 1 }} />
                {userInfo?.name || 'User'}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Đăng xuất
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Button
              color="inherit"
              startIcon={<Login />}
              onClick={() => router.push('/login')}
            >
              Đăng nhập
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonAdd />}
              onClick={() => router.push('/register')}
            >
              Đăng ký
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 