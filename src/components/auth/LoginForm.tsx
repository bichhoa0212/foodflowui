'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Email } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI, AuthRequest } from '@/lib/api';
import { generateChecksum, validatePhone, validateEmail, saveTokens } from '@/lib/utils';

// Schema validation
const loginSchema = yup.object({
  providerUserId: yup.string().required('Vui lòng nhập thông tin đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

type LoginFormData = {
  providerUserId: string;
  password: string;
};

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      providerUserId: '',
      password: '',
    },
  });

  const providerUserId = watch('providerUserId');
  
  // Auto detect provider based on input format
  const detectProvider = (input: string): string => {
    if (validateEmail(input)) {
      return 'EMAIL';
    } else if (validatePhone(input)) {
      return 'PHONE';
    }
    return 'PHONE'; // Default to phone
  };

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Auto detect provider
      const detectedProvider = detectProvider(data.providerUserId);
      
      // Validate input based on detected provider
      if (detectedProvider === 'PHONE' && !validatePhone(data.providerUserId)) {
        setError('Số điện thoại không hợp lệ');
        setLoading(false);
        return;
      }

      if (detectedProvider === 'EMAIL' && !validateEmail(data.providerUserId)) {
        setError('Email không hợp lệ');
        setLoading(false);
        return;
      }

      // Generate checksum
      const checksum = generateChecksum(data.providerUserId, data.password);

      const loginData: AuthRequest = {
        provider: detectedProvider,
        providerUserId: data.providerUserId,
        password: data.password,
        checksum: checksum,
        language: 1,
      };

      const response = await authAPI.login(loginData);
      const { accessToken, refreshToken, userInfo } = response.data;

      // Lưu token
      saveTokens(accessToken, refreshToken);

      setSuccess('Đăng nhập thành công!');
      
      // Redirect sau 1 giây
      setTimeout(() => {
        onSuccess?.();
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Đăng nhập
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Chào mừng bạn trở lại với FoodFlow
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ width: '100%' }}>
          <Controller
            name="providerUserId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Số điện thoại hoặc Email"
                variant="outlined"
                margin="normal"
                error={!!errors.providerUserId}
                helperText={errors.providerUserId?.message}
                placeholder="VD: 0348236580 hoặc example@email.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {detectProvider(providerUserId) === 'EMAIL' ? <Email /> : <Phone />}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="text"
                onClick={onSwitchToRegister}
                sx={{ textTransform: 'none' }}
              >
                Chưa có tài khoản? Đăng ký ngay
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm; 