'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  Favorite,
  History,
  Settings,
  Security,
  Notifications,
  Home,
  Logout,
  Add,
  Delete,
} from '@mui/icons-material';
import { ListItemButton } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Profile.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { userInfo, authenticated, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isDefault: true
    },
    {
      id: 2,
      name: 'Công ty',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      isDefault: false
    }
  ]);
  
  const [formData, setFormData] = useState({
    firstName: userInfo?.name?.split(' ')[0] || '',
    lastName: userInfo?.name?.split(' ').slice(1).join(' ') || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: '',
    avatar: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Gọi API cập nhật thông tin user
      console.log('Cập nhật thông tin:', formData);
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userInfo?.name?.split(' ')[0] || '',
      lastName: userInfo?.name?.split(' ').slice(1).join(' ') || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      address: '',
      avatar: '',
    });
    setIsEditing(false);
    setMessage(null);
  };

  const mockOrders = [
    { id: 1, date: '2024-01-15', status: 'Đã giao', total: 250000 },
    { id: 2, date: '2024-01-10', status: 'Đang giao', total: 180000 },
    { id: 3, date: '2024-01-05', status: 'Đã hủy', total: 120000 },
  ];

  const mockFavorites = [
    { id: 1, name: 'Sản phẩm yêu thích 1', price: 150000 },
    { id: 2, name: 'Sản phẩm yêu thích 2', price: 200000 },
    { id: 3, name: 'Sản phẩm yêu thích 3', price: 180000 },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    setMessage({ type: 'success', text: 'Đã cập nhật địa chỉ mặc định!' });
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    setMessage({ type: 'success', text: 'Đã xóa địa chỉ!' });
  };

  if (!authenticated || !userInfo) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.loadingContainer}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải thông tin...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Typography variant="h4" component="h1" className={styles.pageTitle}>
        Hồ sơ cá nhân
      </Typography>

      <Grid container spacing={3}>
        {/* Thông tin cơ bản */}
        <Grid item xs={12} md={4}>
          <Card className={styles.profileCard}>
            <CardContent className={styles.profileHeader}>
              <Box className={styles.avatarContainer}>
                <Avatar
                  src={formData.avatar}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  className={styles.avatar}
                >
                  {formData.firstName?.charAt(0) || 'U'}
                </Avatar>
                <IconButton 
                  className={styles.editAvatarButton}
                  size="small"
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" className={styles.userName}>
                {formData.firstName} {formData.lastName}
              </Typography>
              
              <Chip 
                label="Thành viên VIP" 
                color="primary" 
                size="small"
                className={styles.vipChip}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Nội dung chính */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Thông tin cá nhân" />
                <Tab label="Đơn hàng" />
                <Tab label="Yêu thích" />
                <Tab label="Địa chỉ giao hàng" />
                <Tab label="Cài đặt" />
              </Tabs>
            </Box>

            {/* Tab Thông tin cá nhân */}
            <TabPanel value={tabValue} index={0}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6">Thông tin cá nhân</Typography>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box className={styles.editActions}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Lưu'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab Đơn hàng */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lịch sử đơn hàng
              </Typography>
              <List>
                {mockOrders.map((order) => (
                  <ListItem key={order.id} divider>
                    <ListItemIcon>
                      <ShoppingBag />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Đơn hàng #${order.id}`}
                      secondary={`${order.date} - ${order.status}`}
                    />
                    <Typography variant="body2" color="primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.total)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            {/* Tab Yêu thích */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sản phẩm yêu thích
              </Typography>
              <List>
                {mockFavorites.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemIcon>
                      <Favorite color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                    />
                    <Typography variant="body2" color="primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(item.price)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            {/* Tab Địa chỉ giao hàng */}
            <TabPanel value={tabValue} index={3}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6">Địa chỉ giao hàng</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="primary"
                >
                  Thêm địa chỉ mới
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {addresses.map((address) => (
                  <Grid item xs={12} key={address.id}>
                    <Card className={styles.addressCard}>
                      <CardContent>
                        <Box className={styles.addressHeader}>
                          <Box>
                            <Typography variant="h6" className={styles.addressName}>
                              {address.name}
                              {address.isDefault && (
                                <Chip 
                                  label="Mặc định" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.phone}
                            </Typography>
                          </Box>
                          <Box className={styles.addressActions}>
                            {!address.isDefault && (
                              <Button
                                size="small"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Đặt mặc định
                              </Button>
                            )}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {address.address}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Tab Cài đặt */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Cài đặt tài khoản
              </Typography>
              <List>
                <ListItemButton>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bảo mật"
                    secondary="Thay đổi mật khẩu và bảo mật tài khoản"
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thông báo"
                    secondary="Cài đặt thông báo và email"
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cài đặt chung"
                    secondary="Tùy chỉnh giao diện và ngôn ngữ"
                  />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Đăng xuất"
                    secondary="Thoát khỏi tài khoản"
                    primaryTypographyProps={{ color: 'error' }}
                  />
                </ListItemButton>
              </List>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 