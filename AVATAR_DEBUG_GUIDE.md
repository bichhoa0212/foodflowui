# Hướng dẫn Debug Vấn đề Avatar

## Vấn đề hiện tại
Avatar không hiển thị sau khi upload thành công, chỉ hiển thị chữ "U" thay vì hình ảnh.

## Các bước Debug

### 1. Kiểm tra Console Logs

Mở Developer Tools (F12) và kiểm tra Console để xem các logs:

```javascript
// Logs từ AvatarUpload component
AvatarUpload currentAvatar: [URL hoặc null]
AvatarUpload currentAvatar type: string
AvatarUpload currentAvatar length: [số]

// Logs từ upload process
Upload response: [response object]
Avatar URL: [URL]
```

### 2. Kiểm tra Network Tab

Trong Network tab của Developer Tools:

1. **Upload Request**: Kiểm tra request `POST /api/user/profile/avatar`
   - Status: 200 OK
   - Response: Có chứa URL avatar

2. **Image Request**: Kiểm tra request GET đến avatar URL
   - Status: 200 OK
   - Content-Type: image/jpeg, image/png, etc.

### 3. Kiểm tra AvatarDebug Component

Component `AvatarDebug` sẽ hiển thị:
- Avatar URL
- URL length
- URL validity
- Profile data
- Test avatar display
- Test image element

### 4. Kiểm tra Backend Logs

Trong Spring Boot logs, tìm:

```
Generated file URL: http://localhost:8080/api/files/[filename]
```

### 5. Kiểm tra File System

Kiểm tra thư mục `uploads/` trong project:
- File có được tạo không?
- File có đúng tên không?
- File có thể đọc được không?

## Các nguyên nhân có thể

### 1. URL không đúng
- **Vấn đề**: URL được tạo không khớp với endpoint thực tế
- **Giải pháp**: Đã sửa trong `FileUploadService.java`

### 2. CORS Issues
- **Vấn đề**: Browser chặn request do CORS
- **Kiểm tra**: Network tab có lỗi CORS không?

### 3. File không tồn tại
- **Vấn đề**: File được upload nhưng không được serve đúng
- **Kiểm tra**: Truy cập trực tiếp URL trong browser

### 4. Content-Type không đúng
- **Vấn đề**: Server trả về Content-Type không đúng
- **Kiểm tra**: Response headers trong Network tab

### 5. Avatar URL không được cập nhật
- **Vấn đề**: Upload thành công nhưng state không được cập nhật
- **Kiểm tra**: Console logs và AvatarDebug component

## Các bước sửa lỗi

### 1. Đã sửa
- ✅ Sửa URL generation trong `FileUploadService`
- ✅ Sửa logic hiển thị avatar trong `AvatarUpload`
- ✅ Thêm debug component
- ✅ Cải thiện error handling

### 2. Cần kiểm tra
- [ ] Console logs có hiển thị URL đúng không?
- [ ] Network request có thành công không?
- [ ] File có được tạo trong uploads/ không?
- [ ] URL có truy cập được trực tiếp không?

### 3. Test Cases
1. **Upload avatar mới**
2. **Refresh page** - avatar có hiển thị không?
3. **Delete avatar** - có xóa được không?
4. **Upload avatar khác** - có thay thế được không?

## Debug Commands

### Kiểm tra file trong uploads/
```bash
ls -la uploads/
```

### Kiểm tra file permissions
```bash
chmod 644 uploads/*
```

### Test URL trực tiếp
```bash
curl -I http://localhost:8080/api/files/[filename]
```

## Logs cần theo dõi

### Frontend Logs
```javascript
// AvatarUpload component
console.log('AvatarUpload currentAvatar:', currentAvatar);

// Upload process
console.log('Upload response:', response);
console.log('Avatar URL:', response.data.data);
```

### Backend Logs
```java
// FileUploadService
log.info("Generated file URL: {}", fileUrl);

// FileController
log.info("Serving file: {}", filename);
```

## Kết quả mong đợi

Sau khi sửa lỗi:
1. ✅ Avatar hiển thị đúng sau upload
2. ✅ Avatar hiển thị đúng sau refresh page
3. ✅ Avatar có thể xóa được
4. ✅ Avatar có thể thay thế được
5. ✅ Không có lỗi trong console
6. ✅ Network requests thành công

## Xóa Debug Component

Sau khi fix xong, xóa component debug:

```tsx
// Trong Profile.tsx, xóa dòng này:
<AvatarDebug 
  avatarUrl={profileData?.avatar} 
  profileData={profileData}
/>
``` 