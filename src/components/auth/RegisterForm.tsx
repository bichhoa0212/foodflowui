'use client';

import React, { useState, useEffect } from 'react';
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
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Email, Person } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI, RegisterRequest } from '@/lib/authApi';
import { generateChecksum, validatePhone, validateEmail, saveTokens } from '@/lib/utils';

// Schema validation
const registerSchema = yup.object({
  name: yup.string().required('Vui lòng nhập họ tên'),
  account: yup
    .string()
    .required('Vui lòng nhập tài khoản đăng nhập')
    .test('email-or-phone', 'Vui lòng nhập email hoặc số điện thoại hợp lệ', function(value) {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,11}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  email: yup.string().email('Email không hợp lệ').optional(),
  phone: yup.string().matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  sex: yup.number().required('Vui lòng chọn giới tính'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
  dateOfBirth: yup.string().required('Vui lòng nhập ngày sinh'),
});

type RegisterFormData = {
  name: string;
  account: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  sex: number;
  address: string;
  dateOfBirth: string;
};

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detectedProvider, setDetectedProvider] = useState<'email' | 'phone' | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      account: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      sex: 1,
      address: '',
      dateOfBirth: '',
    },
  });

  const accountValue = watch('account');

  // Auto-detect provider when account field changes
  useEffect(() => {
    if (accountValue) {
      const provider = validateEmail(accountValue) ? 'email' : validatePhone(accountValue) ? 'phone' : null;
      setDetectedProvider(provider);
      
      // Auto-fill email or phone field based on detected provider
      if (provider === 'email') {
        setValue('email', accountValue);
        setValue('phone', '');
      } else if (provider === 'phone') {
        setValue('phone', accountValue);
        setValue('email', '');
      }
    } else {
      setDetectedProvider(null);
    }
  }, [accountValue, setValue]);

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use the detected provider for the main request
      const provider = detectedProvider || 'email';
      const identifier = data.account;
      
      // Generate checksum based on detected provider
      const checksum = generateChecksum(identifier, data.password);

      const registerData: RegisterRequest = {
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        password: data.password,
        sex: data.sex,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        provider: provider.toUpperCase(),
        providerUserId: identifier,
        checksum: checksum,
        language: 1,
        deviceName: 'Web Browser',
      };

      const response = await authAPI.register(registerData);
      const { accessToken, refreshToken, userInfo } = response.data;

      // Lưu token
      saveTokens(accessToken, refreshToken);

      setSuccess('Đăng ký thành công! Chào mừng bạn đến với FoodFlow');
      
      // Redirect sau 2 giây
      setTimeout(() => {
        onSuccess?.();
      }, 2000);

    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getAccountIcon = () => {
    if (detectedProvider === 'email') return <Email />;
    if (detectedProvider === 'phone') return <Phone />;
    return <Person />;
  };

  const getProviderLabel = () => {
    if (detectedProvider === 'email') return 'Email';
    if (detectedProvider === 'phone') return 'Số điện thoại';
    return 'Tài khoản';
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          marginTop: 4,
          marginBottom: 4,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Đăng ký tài khoản
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tạo tài khoản mới để sử dụng FoodFlow
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

        <Box component="form" onSubmit={handleSubmit(handleRegister)} sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {/* Họ tên */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Họ tên"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Tài khoản đăng nhập chính */}
            <Grid item xs={12}>
              <Controller
                name="account"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tài khoản đăng nhập"
                    placeholder="Nhập email hoặc số điện thoại"
                    variant="outlined"
                    error={!!errors.account}
                    helperText={errors.account?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {getAccountIcon()}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

        

            {/* Email (tùy chọn) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email (tùy chọn)"
                    placeholder="Nhập email bổ sung (không bắt buộc)"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message || "Có thể để trống nếu đã nhập ở trên"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    disabled={detectedProvider === 'email'}
                  />
                )}
              />
            </Grid>

            {/* Số điện thoại (tùy chọn) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Số điện thoại (tùy chọn)"
                    placeholder="Nhập số điện thoại bổ sung (không bắt buộc)"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message || "Có thể để trống nếu đã nhập ở trên"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                    disabled={detectedProvider === 'phone'}
                  />
                )}
              />
            </Grid>

            {/* Mật khẩu */}
            <Grid item xs={12} sm={6}>
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
            </Grid>

            {/* Xác nhận mật khẩu */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Xác nhận mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Giới tính */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sex}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select {...field} label="Giới tính">
                      <MenuItem value={1}>Nam</MenuItem>
                      <MenuItem value={2}>Nữ</MenuItem>
                      <MenuItem value={3}>Khác</MenuItem>
                    </Select>
                    {errors.sex && <FormHelperText>{errors.sex.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    variant="outlined"
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Địa chỉ */}
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Địa chỉ"
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !detectedProvider}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="text"
                onClick={onSwitchToLogin}
                sx={{ textTransform: 'none' }}
              >
                Đã có tài khoản? Đăng nhập ngay
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm; 