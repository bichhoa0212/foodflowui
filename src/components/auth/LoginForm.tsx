'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthRequest } from '@/lib/authApi';
import { generateChecksum, validatePhone, validateEmail } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Schema validation cho form đăng nhập
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

/**
 * Form đăng nhập cho user
 * - Tự động nhận diện loại tài khoản (email/phone)
 * - Validate đầu vào
 * - Gọi API login và xử lý kết quả
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading } = useAuth();

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

  // Tự động nhận diện loại tài khoản
  const detectProvider = (input: string): string => {
    if (validateEmail(input)) return 'EMAIL';
    if (validatePhone(input)) return 'PHONE';
    return 'PHONE'; // Mặc định là phone
  };

  /**
   * Xử lý submit form đăng nhập
   */
  const handleLogin = async (data: LoginFormData) => {
    setError('');
    setSuccess('');
    try {
      // Nhận diện loại tài khoản
      const detectedProvider = detectProvider(data.providerUserId);
      // Validate lại đầu vào
      if (detectedProvider === 'PHONE' && !validatePhone(data.providerUserId)) {
        setError('Số điện thoại không hợp lệ');
        return;
      }
      if (detectedProvider === 'EMAIL' && !validateEmail(data.providerUserId)) {
        setError('Email không hợp lệ');
        return;
      }
      // Sinh checksum
      const checksum = generateChecksum(data.providerUserId, data.password);
      const loginData: AuthRequest = {
        provider: detectedProvider,
        providerUserId: data.providerUserId,
        password: data.password,
        checksum,
        language: 1,
      };
      const success = await login(loginData);
      if (success) {
        setSuccess('Đăng nhập thành công!');
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <div className={styles.title}>Đăng nhập</div>
        {error && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{error}</div>}
        {success && <div className={styles.alert} style={{ background: '#e8f5e9', color: '#1b5e20' }}>{success}</div>}
        <form onSubmit={handleSubmit(handleLogin)} style={{ width: '100%' }}>
          {/* Trường nhập tài khoản (email/phone) */}
          <Controller
            name="providerUserId"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                placeholder="Số điện thoại hoặc Email"
                autoComplete="username"
              />
            )}
          />
          {errors.providerUserId && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.providerUserId.message}</div>}
          {/* Trường nhập mật khẩu */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                autoComplete="current-password"
              />
            )}
          />
          {errors.password && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.password.message}</div>}
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <button
          className={styles.switchLink}
          type="button"
          onClick={onSwitchToRegister}
        >
          Chưa có tài khoản? Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 