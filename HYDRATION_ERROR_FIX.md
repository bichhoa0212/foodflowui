# Sửa lỗi Hydration Error - Next.js

## 🐛 Vấn đề gặp phải

### Lỗi Hydration Error:
```
Hydration failed because the server rendered HTML didn't match the client. 
As a result this tree will be regenerated on the client.
```

### Nguyên nhân:
- **Server/Client mismatch**: Code chạy khác nhau trên server và client
- **localStorage access**: Truy cập localStorage trong server-side rendering
- **Browser extensions**: Extensions can modify DOM trước khi React load
- **Dynamic content**: Content thay đổi giữa server và client render

## 🔧 Cách sửa lỗi

### 1. **Kiểm tra Client-Side trước khi sử dụng Browser APIs**

#### **Trước khi sửa:**
```typescript
// ❌ Sai - Có thể gây lỗi hydration
const token = localStorage.getItem('accessToken');
```

#### **Sau khi sửa:**
```typescript
// ✅ Đúng - Kiểm tra client-side trước
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken');
}
```

### 2. **Sửa AuthContext.tsx**

#### **checkTokenExpiry function:**
```typescript
const checkTokenExpiry = async (): Promise<boolean> => {
  // Kiểm tra xem có đang ở client-side không
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('accessToken');
  // ... rest of the function
};
```

#### **refreshToken function:**
```typescript
const refreshToken = async (): Promise<boolean> => {
  // Kiểm tra xem có đang ở client-side không
  if (typeof window === 'undefined') {
    return false;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  // ... rest of the function
};
```

#### **useEffect hooks:**
```typescript
useEffect(() => {
  const checkAuth = async () => {
    // Kiểm tra xem có đang ở client-side không
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    // ... rest of the function
  };
  
  checkAuth();
  
  // Chỉ thêm event listener nếu ở client-side
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }
}, []);
```

### 3. **Sửa utils.ts**

#### **Tất cả localStorage functions:**
```typescript
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
};

export const getUserInfo = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('accessToken');
  // ... rest of the function
};
```

## 🎯 Best Practices

### 1. **Luôn kiểm tra client-side trước khi sử dụng Browser APIs**

```typescript
// ✅ Đúng
if (typeof window !== 'undefined') {
  // Browser APIs here
  localStorage.getItem('key');
  window.addEventListener('event', handler);
  document.getElementById('element');
}
```

### 2. **Sử dụng useEffect cho client-side logic**

```typescript
useEffect(() => {
  // Chỉ chạy ở client-side
  if (typeof window === 'undefined') return;
  
  // Client-side logic here
}, []);
```

### 3. **Tránh dynamic content trong server render**

```typescript
// ❌ Sai
const randomValue = Math.random();

// ✅ Đúng
const [randomValue, setRandomValue] = useState(0);
useEffect(() => {
  setRandomValue(Math.random());
}, []);
```

### 4. **Sử dụng suppressHydrationWarning cho content thay đổi**

```typescript
// Chỉ sử dụng khi thực sự cần thiết
<div suppressHydrationWarning>
  {dynamicContent}
</div>
```

## 🧪 Testing

### 1. **Test Server-Side Rendering**
```bash
# Build và test production
npm run build
npm start

# Kiểm tra không có lỗi hydration trong console
```

### 2. **Test Client-Side Navigation**
```bash
# Start dev server
npm run dev

# Navigate between pages
# Kiểm tra không có lỗi hydration
```

### 3. **Test với Browser Extensions**
```bash
# Disable browser extensions
# Test lại để xem có phải do extension không
```

## 🐛 Troubleshooting

### 1. **Common Issues**

**localStorage access:**
```typescript
// ❌ Sai
const token = localStorage.getItem('token');

// ✅ Đúng
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
```

**window/document access:**
```typescript
// ❌ Sai
const width = window.innerWidth;

// ✅ Đúng
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

**Date formatting:**
```typescript
// ❌ Sai
const date = new Date().toLocaleDateString();

// ✅ Đúng
const [date, setDate] = useState('');
useEffect(() => {
  setDate(new Date().toLocaleDateString());
}, []);
```

### 2. **Debug Tips**

**Kiểm tra console logs:**
```bash
# Mở Developer Tools
# Kiểm tra Console tab
# Tìm lỗi hydration
```

**Kiểm tra Network tab:**
```bash
# Kiểm tra HTML response
# So sánh server vs client HTML
```

**Sử dụng React DevTools:**
```bash
# Install React DevTools
# Inspect component tree
# Check for mismatches
```

## 📋 Checklist

### ✅ Đã kiểm tra:
- [ ] Tất cả localStorage access có kiểm tra `typeof window !== 'undefined'`
- [ ] useEffect hooks chỉ chạy ở client-side
- [ ] Không có dynamic content trong server render
- [ ] Browser APIs được wrap trong client-side checks
- [ ] Event listeners chỉ được thêm ở client-side

### 🔧 Nếu vẫn có lỗi:

1. **Clear cache và restart:**
   ```bash
   npm run dev
   # Hoặc
   npm run build && npm start
   ```

2. **Disable browser extensions:**
   - Tắt tất cả extensions
   - Test lại

3. **Check for other dynamic content:**
   - Math.random()
   - Date.now()
   - User locale
   - External data

## 🎉 Kết quả

Sau khi áp dụng các fixes:

- ✅ **Không còn lỗi hydration**
- ✅ **Server và client render giống nhau**
- ✅ **localStorage access an toàn**
- ✅ **Browser APIs được handle đúng cách**
- ✅ **Performance tốt hơn**

---

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra console logs
2. Disable browser extensions
3. Test với production build
4. Review tất cả dynamic content
5. Check for other browser APIs usage 