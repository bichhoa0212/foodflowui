# FoodFlow UI

Frontend ứng dụng đặt đồ ăn trực tuyến FoodFlow được xây dựng bằng Next.js và Material-UI.

## Tính năng

- ✅ Đăng nhập/Đăng ký tài khoản
- ✅ Giao diện responsive với Material-UI
- ✅ Kết nối với backend FoodFlow API
- ✅ Quản lý authentication với JWT
- ✅ Form validation với Yup
- ✅ TypeScript support

## Cấu trúc dự án

```
foodflowui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Trang authentication
│   │   ├── login/             # Trang đăng nhập
│   │   ├── register/          # Trang đăng ký
│   │   ├── globals.css        # CSS toàn cục
│   │   ├── layout.tsx         # Layout chính
│   │   └── page.tsx           # Trang chủ
│   ├── components/            # React components
│   │   └── auth/              # Components authentication
│   │       ├── LoginForm.tsx  # Form đăng nhập
│   │       └── RegisterForm.tsx # Form đăng ký
│   └── lib/                   # Utilities và API
│       ├── api.ts             # API client
│       └── utils.ts           # Helper functions
├── package.json
└── README.md
```

## Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies

```bash
# Cài đặt dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### Cấu hình môi trường

Tạo file `.env.local` trong thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Chạy ứng dụng

### Development mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Build production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/test` - Test endpoint
- `GET /api/auth/cors-test` - CORS test
- `GET /api/auth/default-users` - Thông tin user mặc định

### Request/Response Examples

#### Đăng nhập
```json
{
  "provider": "PHONE",
  "providerUserId": "0348236580",
  "password": "123456",
  "checksum": "f9f339b206c764044aa8b51b7ccea74ea3f983b0030db9503ee6200e1f15de7f",
  "language": 1
}
```

#### Đăng ký
```json
{
  "name": "Nguyễn Văn A",
  "email": "example@email.com",
  "phone": "0348236580",
  "password": "123456",
  "sex": 1,
  "address": "123 Đường ABC, Quận XYZ, TP.HCM",
  "dateOfBirth": "1990-01-01",
  "provider": "EMAIL",
  "providerUserId": "example@email.com",
  "checksum": "f9f339b206c764044aa8b51b7ccea74ea3f983b0030db9503ee6200e1f15de7f",
  "language": 1,
  "deviceName": "Web Browser"
}
```

## Tài khoản mặc định

Backend đã tạo sẵn các tài khoản mặc định:

1. **Admin User:**
   - Email: admin@foodflow.com
   - Password: admin123
   - Role: SUPER_ADMIN

2. **Customer User:**
   - Email: customer@foodflow.com
   - Password: customer123
   - Role: CUSTOMER

3. **Restaurant Owner:**
   - Email: restaurant@foodflow.com
   - Password: restaurant123
   - Role: RESTAURANT_OWNER

4. **Delivery Driver:**
   - Email: driver@foodflow.com
   - Password: driver123
   - Role: DELIVERY_DRIVER

## Công nghệ sử dụng

- **Frontend Framework:** Next.js 15
- **UI Library:** Material-UI (MUI) v5
- **Form Management:** React Hook Form + Yup
- **HTTP Client:** Axios
- **Language:** TypeScript
- **Styling:** Material-UI System + CSS-in-JS

## Tính năng chính

### Authentication
- Đăng nhập bằng email hoặc số điện thoại
- Đăng ký tài khoản mới với đầy đủ thông tin
- JWT token management
- Auto refresh token
- Form validation

### UI/UX
- Responsive design
- Material Design principles
- Dark/Light theme support
- Loading states
- Error handling
- Success notifications

### Security
- SHA256 checksum validation
- Input sanitization
- Token-based authentication
- Secure password handling

## Development

### Cấu trúc components

#### LoginForm
- Form validation với Yup
- Support đăng nhập bằng email/phone
- Password visibility toggle
- Error handling
- Loading states

#### RegisterForm
- Multi-step form validation
- File upload support
- Real-time validation
- Success feedback

#### API Client
- Axios interceptors
- Automatic token refresh
- Error handling
- Request/response logging

## Troubleshooting

### Lỗi CORS
Đảm bảo backend đã cấu hình CORS cho domain frontend:

```java
@CrossOrigin(origins = {"http://localhost:3000"})
```

### Lỗi kết nối API
Kiểm tra:
1. Backend đang chạy tại port 8080
2. API endpoint đúng
3. Network connectivity

### Lỗi TypeScript
Chạy lệnh để fix linter errors:
```bash
npm run lint -- --fix
```

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.

## Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ:
- Email: support@foodflow.com
- Hotline: 1900-xxxx
