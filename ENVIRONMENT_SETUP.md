# Environment Setup Guide

## Cấu hình Environment Variables

### 1. Tạo file .env.local

Tạo file `.env.local` trong thư mục gốc của dự án `foodflowui`:

```bash
# FoodFlow UI Environment Configuration

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Application Secret Key
APP_SECRET_KEY=793ddabd7c83070cd1ac72877edd9d29

# JWT Configuration
JWT_SECRET=793ddabd7c83070cd1ac72877edd9d29
JWT_REFRESH_SECRET=793ddabd7c83070cd1ac72877edd9d29

# Server Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_LOGGING=true
```

### 2. Các biến môi trường quan trọng

#### **APP_SECRET_KEY**
- **Mô tả:** Secret key để tạo checksum bảo mật
- **Giá trị:** `793ddabd7c83070cd1ac72877edd9d29`
- **Sử dụng:** Trong hàm `generateChecksum()` để tạo checksum an toàn

#### **NEXT_PUBLIC_API_URL**
- **Mô tả:** URL của backend API
- **Giá trị:** `http://localhost:8080/api`
- **Sử dụng:** Kết nối với backend FoodFlow

#### **JWT_SECRET & JWT_REFRESH_SECRET**
- **Mô tả:** Secret key cho JWT tokens
- **Giá trị:** `793ddabd7c83070cd1ac72877edd9d29`
- **Sử dụng:** Xác thực và bảo mật tokens

### 3. Cách sử dụng trong code

#### **Trong utils.ts:**
```typescript
const getSecretKey = (): string => {
  return process.env.APP_SECRET_KEY || '793ddabd7c83070cd1ac72877edd9d29';
};

export const generateChecksum = (providerUserId: string, password: string): string => {
  const secretKey = getSecretKey();
  const data = `${providerUserId}${password}${secretKey}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
```

#### **Trong next.config.ts:**
```typescript
env: {
  APP_SECRET_KEY: process.env.APP_SECRET_KEY || "793ddabd7c83070cd1ac72877edd9d29",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
}
```

### 4. Kiểm tra cấu hình

#### **Test trong TestAPI component:**
1. Truy cập: `http://localhost:3000/test`
2. Chọn "Use Secret Key in Checksum" để test với secret key
3. Bỏ chọn để test với checksum đơn giản

#### **Logs trong console:**
```javascript
// Với secret key
🚀 [LOGIN] Request Data: {
  "provider": "PHONE",
  "providerUserId": "0348236580",
  "password": "123456",
  "checksum": "a1b2c3d4e5f6...", // Checksum với secret key
  "language": 1
}

// Không có secret key
🚀 [LOGIN] Request Data: {
  "provider": "PHONE",
  "providerUserId": "0348236580",
  "password": "123456",
  "checksum": "f9f339b206c764044aa8b51b7ccea74ea3f983b0030db9503ee6200e1f15de7f", // Checksum đơn giản
  "language": 1
}
```

### 5. Production Configuration

Khi deploy lên production, cập nhật các giá trị:

```bash
# Production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
APP_SECRET_KEY=your-production-secret-key
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### 6. Security Notes

⚠️ **Lưu ý bảo mật:**
- Không commit file `.env.local` vào git
- Sử dụng secret key mạnh trong production
- Rotate secret keys định kỳ
- Sử dụng HTTPS trong production

### 7. Troubleshooting

#### **Lỗi "Secret key not found":**
```bash
# Kiểm tra file .env.local tồn tại
ls -la .env.local

# Kiểm tra biến môi trường
echo $APP_SECRET_KEY
```

#### **Lỗi "API URL not found":**
```bash
# Kiểm tra backend đang chạy
curl http://localhost:8080/api/auth/test
```

#### **Lỗi CORS:**
Đảm bảo backend đã cấu hình CORS cho domain frontend. 