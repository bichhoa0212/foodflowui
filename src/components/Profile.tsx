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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { userProfileApi, UserProfileDto, UserAddressDto, UserFavoriteDto, PageData } from '@/lib/userProfileApi';
import styles from './Profile.module.css';
import AvatarUpload from './AvatarUpload';
import { AvatarDebug } from './common/AvatarDebug';
import { useRouter } from 'next/navigation';

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
  const { userInfo, authenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile data
  const [profileData, setProfileData] = useState<UserProfileDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Addresses data
  const [addresses, setAddresses] = useState<UserAddressDto[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  
  // Favorites data
  const [favorites, setFavorites] = useState<UserFavoriteDto[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesPage, setFavoritesPage] = useState(0);
  const [favoritesTotal, setFavoritesTotal] = useState(0);
  
  // Dialog states
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressDto | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    isDefault: false,
    status: 1,
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });

  // Kiểm tra authentication và load data
  useEffect(() => {
    if (!authenticated && !authLoading) {
      router.push('/login');
      return;
    }
    
    if (authenticated) {
      loadProfileData();
      loadAddresses();
      loadFavorites();
    }
  }, [authenticated, authLoading, router]);

  const loadProfileData = async () => {
    try {
      setProfileLoading(true);
      const response = await userProfileApi.getProfile();
      const profile = response.data.data;
      setProfileData(profile);
      
      // Update form data
      const nameParts = profile.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: profile.avatar || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await userProfileApi.getAddresses();
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách địa chỉ.' });
    } finally {
      setAddressesLoading(false);
    }
  };

  const loadFavorites = async (page: number = 0) => {
    try {
      setFavoritesLoading(true);
      const response = await userProfileApi.getFavorites(page, 10);
      const favoritesData: PageData<UserFavoriteDto> = response.data.data;
      setFavorites(favoritesData.data);
      setFavoritesTotal(favoritesData.totalElements);
      setFavoritesPage(page);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách yêu thích.' });
    } finally {
      setFavoritesLoading(false);
    }
  };

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
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };
      
      await userProfileApi.updateProfile(updateData);
      
      // Reload profile data
      await loadProfileData();
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      const nameParts = profileData.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        avatar: '',
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  // Address handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      name: '',
      phone: '',
      address: '',
      province: '',
      district: '',
      ward: '',
      isDefault: false,
      status: 1,
    });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: UserAddressDto) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      phone: address.phone,
      address: address.address,
      province: address.province,
      district: address.district,
      ward: address.ward,
      isDefault: address.isDefault,
      status: address.status,
    });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      
      if (editingAddress) {
        await userProfileApi.updateAddress(editingAddress.id, newAddress);
        setMessage({ type: 'success', text: 'Cập nhật địa chỉ thành công!' });
      } else {
        await userProfileApi.addAddress(newAddress);
        setMessage({ type: 'success', text: 'Thêm địa chỉ thành công!' });
      }
      
      setAddressDialogOpen(false);
      await loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu địa chỉ.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      setLoading(true);
      await userProfileApi.deleteAddress(addressId);
      setMessage({ type: 'success', text: 'Đã xóa địa chỉ!' });
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi xóa địa chỉ.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      setLoading(true);
      await userProfileApi.setDefaultAddress(addressId);
      setMessage({ type: 'success', text: 'Đã cập nhật địa chỉ mặc định!' });
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đặt địa chỉ mặc định.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    try {
      setLoading(true);
      await userProfileApi.removeFromFavorites(productId);
      setMessage({ type: 'success', text: 'Đã xóa khỏi danh sách yêu thích!' });
      await loadFavorites(favoritesPage);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi xóa khỏi yêu thích.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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

  if (profileLoading) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.loadingContainer}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải thông tin hồ sơ...
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

      {/* Debug Component - Remove after fixing */}
      {/* <AvatarDebug 
        avatarUrl={profileData?.avatar} 
        profileData={profileData}
      /> */}

      <Grid container spacing={3}>
        {/* Thông tin cơ bản */}
        <Grid item xs={12} md={4}>
          <Card className={styles.profileCard}>
            <CardContent className={styles.profileHeader}>
              <AvatarUpload
                currentAvatar={profileData?.avatar || ''}
                onAvatarChange={(avatarUrl) => {
                  console.log('Avatar changed to:', avatarUrl);
                  // Cập nhật cả profileData và formData
                  setProfileData(prev => prev ? { ...prev, avatar: avatarUrl } : null);
                  setFormData(prev => ({ ...prev, avatar: avatarUrl }));
                  setMessage({ type: 'success', text: 'Cập nhật avatar thành công!' });
                }}
                onAvatarDelete={() => {
                  console.log('Avatar deleted');
                  // Cập nhật cả profileData và formData
                  setProfileData(prev => prev ? { ...prev, avatar: '' } : null);
                  setFormData(prev => ({ ...prev, avatar: '' }));
                  setMessage({ type: 'success', text: 'Xóa avatar thành công!' });
                }}
                disabled={!isEditing}
              />
              
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
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Tính năng này sẽ được phát triển trong phiên bản tiếp theo
                </Typography>
              </Box>
            </TabPanel>

            {/* Tab Yêu thích */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sản phẩm yêu thích ({favoritesTotal})
              </Typography>
              
              {favoritesLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : favorites.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Bạn chưa có sản phẩm yêu thích nào
                  </Typography>
                </Box>
              ) : (
                <List>
                  {favorites.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemIcon>
                        <Favorite color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.productName}
                        secondary={item.productDescription}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="primary">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.productPrice)}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFavorite(item.productId)}
                          disabled={loading}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>

            {/* Tab Địa chỉ giao hàng */}
            <TabPanel value={tabValue} index={3}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6">Địa chỉ giao hàng</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="primary"
                  onClick={handleAddAddress}
                >
                  Thêm địa chỉ mới
                </Button>
              </Box>
              
              {addressesLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : addresses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Bạn chưa có địa chỉ giao hàng nào
                  </Typography>
                </Box>
              ) : (
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
                                  disabled={loading}
                                >
                                  Đặt mặc định
                                </Button>
                              )}
                              <Button
                                size="small"
                                onClick={() => handleEditAddress(address)}
                                disabled={loading}
                              >
                                Sửa
                              </Button>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={loading}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {address.address}, {address.ward}, {address.district}, {address.province}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
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

      {/* Dialog thêm/sửa địa chỉ */}
      <Dialog 
        open={addressDialogOpen} 
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên địa chỉ"
                value={newAddress.name}
                onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={newAddress.phone}
                onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ chi tiết"
                multiline
                rows={3}
                value={newAddress.address}
                onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tỉnh/Thành phố"
                value={newAddress.province}
                onChange={(e) => setNewAddress(prev => ({ ...prev, province: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                value={newAddress.district}
                onChange={(e) => setNewAddress(prev => ({ ...prev, district: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phường/Xã"
                value={newAddress.ward}
                onChange={(e) => setNewAddress(prev => ({ ...prev, ward: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSaveAddress} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 