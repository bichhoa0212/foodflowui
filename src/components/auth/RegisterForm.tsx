"use client";

import React, { useState, useEffect } from 'react';
import styles from './RegisterForm.module.css';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI, RegisterRequest } from '@/lib/authApi';
import { generateChecksum, validatePhone, validateEmail, detectProvider } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detectedProvider, setDetectedProvider] = useState<'email' | 'phone' | null>(null);
  const { login, loading } = useAuth();

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

  useEffect(() => {
    if (accountValue) {
      const provider = detectProvider(accountValue).toLowerCase();
      setDetectedProvider(provider as 'email' | 'phone');
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
    setError('');
    setSuccess('');
    try {
      const provider = detectedProvider || 'email';
      const identifier = data.account;
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
        checksum,
        language: 1,
        deviceName: 'Web Browser',
      };
      const response = await authAPI.register(registerData);
      const loginData = {
        provider: provider.toUpperCase(),
        providerUserId: identifier,
        password: data.password,
        checksum,
        language: 1,
      };
      const loginSuccess = await login(loginData);
      if (loginSuccess) {
        setSuccess('Đăng ký thành công! Chào mừng bạn đến với FoodFlow');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setError('Đăng ký thành công nhưng đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <div className={styles.title}>Đăng ký tài khoản</div>
        {error && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{error}</div>}
        {success && <div className={styles.alert} style={{ background: '#e8f5e9', color: '#1b5e20' }}>{success}</div>}
        <form onSubmit={handleSubmit(handleRegister)} style={{ width: '100%' }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                placeholder="Họ tên"
                autoComplete="name"
              />
            )}
          />
          {errors.name && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.name.message}</div>}
          <Controller
            name="account"
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
          {errors.account && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.account.message}</div>}
          {detectedProvider !== 'email' && (
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.input}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
              )}
            />
          )}
          {errors.email && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.email.message}</div>}
          {detectedProvider !== 'phone' && (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.input}
                  placeholder="Số điện thoại"
                  autoComplete="tel"
                />
              )}
            />
          )}
          {errors.phone && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.phone.message}</div>}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                type="password"
                placeholder="Mật khẩu"
                autoComplete="new-password"
              />
            )}
          />
          {errors.password && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.password.message}</div>}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                type="password"
                placeholder="Xác nhận mật khẩu"
                autoComplete="new-password"
              />
            )}
          />
          {errors.confirmPassword && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.confirmPassword.message}</div>}
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <select {...field} className={styles.input}>
                <option value={1}>Nam</option>
                <option value={2}>Nữ</option>
                <option value={3}>Khác</option>
              </select>
            )}
          />
          {errors.sex && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.sex.message}</div>}
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                type="date"
                placeholder="Ngày sinh"
                autoComplete="bday"
              />
            )}
          />
          {errors.dateOfBirth && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.dateOfBirth.message}</div>}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={styles.input}
                placeholder="Địa chỉ"
                autoComplete="street-address"
              />
            )}
          />
          {errors.address && <div className={styles.alert} style={{ background: '#fdecea', color: '#b71c1c' }}>{errors.address.message}</div>}
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <button
          className={styles.switchLink}
          type="button"
          onClick={onSwitchToLogin}
        >
          Đã có tài khoản? Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default RegisterForm; 