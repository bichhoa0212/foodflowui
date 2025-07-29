# Hướng dẫn Debug Vấn đề CORS

## Vấn đề hiện tại
Lỗi CORS khi truy cập avatar image:
```
When allowCredentials is true, allowedOrigins cannot contain the special value "*"
```

## Nguyên nhân
Khi `allowCredentials` được set là `true`, bạn không thể sử dụng `allowedOrigins: "*"` vì browser không cho phép gửi credentials đến wildcard origin.

## Các sửa đổi đã thực hiện

### 1. Sửa CorsConfig.java
```java
// Thay đổi từ:
.allowedOrigins("http://192.168.21.26:3000")
.allowedOriginPatterns("*")

// Thành:
.allowedOriginPatterns("*") // Chỉ sử dụng patterns
```

### 2. Loại bỏ @CrossOrigin trong FileController
```java
// Thay đổi từ:
@GetMapping("/{filename:.+}")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public ResponseEntity<Resource> serveFile(@PathVariable String filename)

// Thành:
@GetMapping("/{filename:.+}")
public ResponseEntity<Resource> serveFile(@PathVariable String filename)
```

### 3. Tạo fileApi instance riêng
```typescript
// Instance riêng cho file upload (không có withCredentials)
const fileApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 30000,
  withCredentials: false, // Không gửi credentials
});
```

## Các bước test

### 1. Restart Backend
```bash
# Dừng Spring Boot application
# Chạy lại:
./mvnw spring-boot:run
```

### 2. Test CORS với curl
```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  http://localhost:8080/api/files/test.jpg

# Test actual request
curl -X GET \
  -H "Origin: http://localhost:3000" \
  http://localhost:8080/api/files/test.jpg
```

### 3. Test trong Browser
1. Mở Developer Tools (F12)
2. Vào Network tab
3. Truy cập avatar URL trực tiếp
4. Kiểm tra response headers

### 4. Test Upload Avatar
1. Vào trang Profile
2. Upload avatar mới
3. Kiểm tra console logs
4. Kiểm tra Network tab

## Debug Commands

### Kiểm tra CORS headers
```bash
curl -I -H "Origin: http://localhost:3000" \
  http://localhost:8080/api/files/test.jpg
```

### Kiểm tra file tồn tại
```bash
curl http://localhost:8080/api/files/test/check/test.jpg
```

### Liệt kê files
```bash
curl http://localhost:8080/api/files/test/list
```

## Expected Headers

Response headers nên có:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### 1. Lỗi "CORS policy blocked"
- Kiểm tra backend logs
- Đảm bảo CorsConfig được load
- Restart backend

### 2. Lỗi "No 'Access-Control-Allow-Origin' header"
- Kiểm tra cấu hình CORS
- Đảm bảo không có @CrossOrigin conflict

### 3. Lỗi "Credentials not supported"
- Đảm bảo withCredentials: false cho file upload
- Kiểm tra allowCredentials trong backend

### 4. Avatar không hiển thị
- Kiểm tra file có tồn tại không
- Kiểm tra URL có đúng không
- Kiểm tra Content-Type

## Logs cần theo dõi

### Backend Logs
```
INFO  - Serving file: test.jpg
INFO  - File path: /path/to/uploads/test.jpg
INFO  - Resource exists: true, readable: true
INFO  - Detected media type: image/jpeg
```

### Frontend Logs
```javascript
// AvatarUpload component
console.log('Upload response:', response);
console.log('Avatar URL:', response.data.data);

// Network tab
// Status: 200 OK
// Content-Type: image/jpeg
```

## Test Cases

### 1. Upload Avatar
- [ ] Upload thành công
- [ ] Avatar hiển thị ngay lập tức
- [ ] Không có lỗi CORS

### 2. Refresh Page
- [ ] Avatar vẫn hiển thị
- [ ] Không có lỗi CORS

### 3. Delete Avatar
- [ ] Xóa thành công
- [ ] Avatar biến mất
- [ ] Không có lỗi CORS

### 4. Upload Avatar Khác
- [ ] Thay thế avatar cũ
- [ ] Avatar mới hiển thị
- [ ] Không có lỗi CORS

## Kết quả mong đợi

Sau khi sửa:
1. ✅ Không có lỗi CORS
2. ✅ Avatar hiển thị đúng
3. ✅ Upload/delete hoạt động
4. ✅ Network requests thành công
5. ✅ Response headers đúng

## Rollback nếu cần

Nếu vẫn có vấn đề, có thể rollback:

### 1. Revert CorsConfig
```java
.allowedOrigins("http://localhost:3000", "http://192.168.21.26:3000")
.allowedOriginPatterns("*")
```

### 2. Revert FileController
```java
@CrossOrigin(origins = "*", allowedHeaders = "*")
```

### 3. Revert userProfileApi
```typescript
// Sử dụng api instance thay vì fileApi
return api.post('/user/profile/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
``` 