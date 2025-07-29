# Hướng dẫn Quản lý Token và Refresh Token

## Tổng quan

Dự án đã được cải thiện với hệ thống quản lý token tự động để xử lý vấn đề token hết hạn. Hệ thống bao gồm:

1. **Tự động refresh token** khi sắp hết hạn
2. **Interceptor axios** để xử lý lỗi 401
3. **Kiểm tra token** trước khi gửi request
4. **Queue system** để tránh vòng lặp vô hạn

## Các tính năng chính

### 1. AuthContext (Context Provider)

**File:** `src/contexts/AuthContext.tsx`

- **Tự động kiểm tra token** khi component mount
- **Tự động refresh token** khi sắp hết hạn (< 5 phút)
- **Kiểm tra định kỳ** mỗi phút
- **Xử lý đa tab** (sync localStorage)

```typescript
const { authenticated, userInfo, loading, checkTokenExpiry } = useAuth();

// Kiểm tra token trước khi gửi request
const isValid = await checkTokenExpiry();
```

### 2. Axios Interceptor

**File:** `src/lib/baseApi.ts`

- **Tự động thêm token** vào header
- **Xử lý lỗi 401** tự động
- **Queue system** để tránh multiple refresh calls
- **Tạo instance mới** để tránh vòng lặp vô hạn

### 3. Utility Functions

**File:** `src/lib/utils.ts`

```typescript
// Kiểm tra token sắp hết hạn
isTokenExpiringSoon(): boolean

// Kiểm tra token đã hết hạn
isTokenExpired(): boolean

// Lấy thời gian còn lại
getTokenTimeRemaining(): number

// Lấy thông tin user từ token
getUserInfo(): any
```

### 4. Custom Hooks

**File:** `src/hooks/useAuthGuard.ts`

```typescript
// Hook bảo vệ component
const { authenticated, loading } = useAuthGuard('/login');

// Hook kiểm tra token
const { ensureValidToken } = useTokenCheck();
```

### 5. TokenInfo Component

**File:** `src/components/common/TokenInfo.tsx`

Component để hiển thị thông tin token (dùng cho debug):

```typescript
// Hiển thị đơn giản
<TokenInfo />

// Hiển thị chi tiết
<TokenInfo showDetails={true} />
```

## Cách sử dụng

### 1. Trong Component cần Authentication

```typescript
import { useAuthGuard } from '@/hooks/useAuthGuard';

const ProtectedComponent = () => {
  const { authenticated, loading } = useAuthGuard('/login');
  
  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null; // Sẽ redirect tự động
  
  return <div>Protected Content</div>;
};
```

### 2. Trước khi gửi API Request

```typescript
import { useTokenCheck } from '@/hooks/useAuthGuard';

const MyComponent = () => {
  const { ensureValidToken } = useTokenCheck();
  
  const handleApiCall = async () => {
    // Kiểm tra token trước khi gửi request
    const isValid = await ensureValidToken();
    if (!isValid) {
      // Token không hợp lệ, user sẽ được redirect
      return;
    }
    
    // Gửi API request
    const response = await api.get('/some-endpoint');
  };
};
```

### 3. Sử dụng trong API Functions

```typescript
import { isTokenExpiringSoon } from '@/lib/utils';

export const someApiFunction = async () => {
  // Kiểm tra token sắp hết hạn
  if (isTokenExpiringSoon()) {
    console.log('Token sắp hết hạn, cần refresh');
  }
  
  // Gửi request (interceptor sẽ tự động xử lý)
  return await api.get('/endpoint');
};
```

## Luồng xử lý

### 1. Khi gửi Request

```
Request → Axios Interceptor → Thêm Token → Gửi Request
```

### 2. Khi nhận lỗi 401

```
Lỗi 401 → Kiểm tra đang refresh? → Queue request
         → Gọi API refresh → Lưu token mới → Retry request
         → Xử lý queue → Thành công
```

### 3. Tự động kiểm tra

```
Component Mount → Kiểm tra token → Sắp hết hạn? → Refresh
                → Còn hợp lệ → OK
```

## Cấu hình

### 1. Thời gian refresh

Trong `AuthContext.tsx`, có thể thay đổi thời gian kiểm tra:

```typescript
// Kiểm tra mỗi phút
const interval = setInterval(async () => {
  await checkTokenExpiry();
}, 60 * 1000);

// Refresh khi còn < 5 phút
if (timeUntilExpiry < 5 * 60 * 1000) {
  // Refresh token
}
```

### 2. Timeout API

Trong `baseApi.ts`:

```typescript
const api = axios.create({
  timeout: 10000, // 10 giây
});
```

## Debug và Monitoring

### 1. Sử dụng TokenInfo Component

```typescript
import { TokenInfo } from '@/components/common/TokenInfo';

// Trong component debug
<TokenInfo showDetails={true} />
```

### 2. Console Logs

Hệ thống sẽ log các thông tin:

```
Token đã hết hạn, thử refresh...
Token sắp hết hạn, thử refresh...
Refresh token thành công
Refresh token thất bại
```

### 3. Browser DevTools

- Kiểm tra localStorage: `accessToken`, `refreshToken`
- Network tab: xem các request refresh token
- Console: xem logs

## Troubleshooting

### 1. Vòng lặp vô hạn

- Đã được xử lý bằng queue system
- Tạo instance axios mới cho refresh request

### 2. Token không refresh

- Kiểm tra refresh token có hợp lệ không
- Kiểm tra API endpoint `/auth/refresh`
- Kiểm tra network connection

### 3. User bị logout liên tục

- Kiểm tra refresh token có hết hạn không
- Kiểm tra backend có trả về token mới không
- Kiểm tra localStorage có bị clear không

## Best Practices

1. **Luôn sử dụng `useAuthGuard`** cho các trang protected
2. **Kiểm tra token trước** khi gửi request quan trọng
3. **Xử lý lỗi** khi gọi API
4. **Test các trường hợp** token hết hạn
5. **Monitor logs** để debug

## Lưu ý

- Hệ thống tự động xử lý hầu hết các trường hợp
- Chỉ cần sử dụng `useAuthGuard` cho các trang cần bảo vệ
- Interceptor sẽ tự động xử lý refresh token
- Không cần gọi refresh token thủ công trong hầu hết trường hợp 