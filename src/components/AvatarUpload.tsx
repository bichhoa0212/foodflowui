import React, { useState, useRef } from 'react';
import { Avatar, Button, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { PhotoCamera, Delete, Login } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { userProfileApi } from '@/lib/userProfileApi';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  onAvatarDelete: () => void;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  onAvatarDelete,
  disabled = false
}) => {
  const { authenticated } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra authentication trước khi upload
    if (!authenticated) {
      setShowAuthMessage(true);
      return;
    }

    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Kiểm tra kích thước file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File không được lớn hơn 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const response = await userProfileApi.uploadAvatar(file);
      console.log('Upload response:', response);
      console.log('Avatar URL:', response.data.data);
      onAvatarChange(response.data.data);
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        setError(err.response?.data?.message || err.message || 'Upload thất bại');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    // Kiểm tra authentication trước khi xóa
    if (!authenticated) {
      setShowAuthMessage(true);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await userProfileApi.deleteAvatar();
      onAvatarDelete();
    } catch (err: any) {
      console.error('Delete error:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        setError(err.response?.data?.message || err.message || 'Xóa avatar thất bại');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      // Kiểm tra authentication trước khi cho phép chọn file
      if (!authenticated) {
        setShowAuthMessage(true);
        return;
      }
      fileInputRef.current?.click();
    }
  };

  const handleLoginClick = () => {
    setShowAuthMessage(false);
    router.push('/login');
  };

  console.log('AvatarUpload currentAvatar:', currentAvatar);
  console.log('AvatarUpload currentAvatar type:', typeof currentAvatar);
  console.log('AvatarUpload currentAvatar length:', currentAvatar?.length);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={currentAvatar}
          sx={{
            width: 120,
            height: 120,
            cursor: disabled || uploading ? 'default' : 'pointer',
            opacity: uploading ? 0.7 : 1,
          }}
          onClick={handleClick}
        >
          {currentAvatar ? '' : 'U'}
        </Avatar>
        
        {uploading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<PhotoCamera />}
          onClick={handleClick}
          disabled={disabled || uploading}
          size="small"
        >
          {uploading ? 'Đang upload...' : 'Chọn ảnh'}
        </Button>
        
        {currentAvatar && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteAvatar}
            disabled={disabled || uploading}
            size="small"
          >
            {uploading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      {/* Snackbar thông báo yêu cầu đăng nhập */}
      <Snackbar
        open={showAuthMessage}
        autoHideDuration={6000}
        onClose={() => setShowAuthMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          sx={{ width: '100%' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Login />}
              onClick={handleLoginClick}
            >
              Đăng nhập
            </Button>
          }
        >
          Bạn cần đăng nhập để upload hoặc xóa avatar
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AvatarUpload; 