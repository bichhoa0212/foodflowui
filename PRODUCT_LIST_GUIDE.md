# Màn hình Danh sách Sản phẩm theo Loại - Hướng dẫn

## 🎯 Tổng quan

Màn hình hiển thị danh sách sản phẩm theo danh mục với đầy đủ tính năng:
- **Filter theo danh mục**
- **Tìm kiếm theo tên**
- **Sắp xếp** (tên, giá, đánh giá)
- **Lọc theo khoảng giá**
- **Phân trang**
- **Responsive design**

## 📁 Cấu trúc Files

### Frontend (Next.js)
```
foodflowui/src/app/product/
├── page.tsx                    # Trang danh sách sản phẩm chính
└── admin.tsx                   # Trang quản lý sản phẩm (admin)

foodflowui/src/components/product/
└── ProductCard.tsx             # Component hiển thị sản phẩm

foodflowui/src/lib/
└── productApi.ts               # API calls cho sản phẩm
```

### Backend (Spring Boot)
```
foodflow/src/main/java/project/foodflow/
├── controller/product/
│   └── ApiProductController.java    # API endpoints cho sản phẩm
├── controller/catergory/
│   └── ApiCatergoryController.java  # API endpoints cho danh mục
├── dto/
│   ├── ProductDto.java              # DTO cho sản phẩm
│   └── CategoryDto.java             # DTO cho danh mục
├── repository/
│   ├── ProductRepository.java       # Repository cho sản phẩm
│   └── ReviewRepository.java        # Repository cho đánh giá
└── service/
    └── CategoryService.java         # Service cho danh mục
```

## 🚀 Tính năng chính

### 1. **Filter và Search**
- **Danh mục**: Lọc theo category
- **Tìm kiếm**: Theo tên sản phẩm
- **Khoảng giá**: Min - Max price
- **Sắp xếp**: Tên A-Z, Z-A, Giá tăng/giảm, Đánh giá, Review count

### 2. **Product Card**
- **Hình ảnh sản phẩm** với fallback
- **Tên và mô tả** với text truncation
- **Giá** được format
- **Rating** và số lượng review
- **Stock info** và trạng thái hết hàng
- **Category badge**
- **Action buttons**: Add to cart, Favorite, Quick view

### 3. **Pagination**
- **12 sản phẩm/trang**
- **Navigation** với Material-UI Pagination
- **Auto reset** khi thay đổi filter

### 4. **Responsive Design**
- **Desktop**: 3-4 sản phẩm/hàng
- **Tablet**: 2-3 sản phẩm/hàng  
- **Mobile**: 1-2 sản phẩm/hàng
- **Sidebar** collapse trên mobile

## 🔌 API Endpoints

### 1. **Lấy danh sách sản phẩm**
```http
GET /api/products
```

**Parameters:**
- `page` (int, default: 0): Số trang (0-based)
- `size` (int, default: 12): Số sản phẩm/trang
- `categoryId` (Long, optional): ID danh mục
- `name` (String, optional): Tên sản phẩm để search
- `sort` (String, default: "name,asc"): Sắp xếp (field,direction)
- `minPrice` (Double, optional): Giá tối thiểu
- `maxPrice` (Double, optional): Giá tối đa

**Response:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Sản phẩm 1",
        "description": "Mô tả sản phẩm",
        "imageUrl": "http://...",
        "price": 100000,
        "stock": 10,
        "categoryId": 1,
        "categoryName": "Điện tử",
        "rating": 4.5,
        "reviewCount": 25,
        "purchaseCount": 100
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
    "size": 12,
    "number": 0
  }
}
```

### 2. **Lấy chi tiết sản phẩm**
```http
GET /api/products/{id}
```

### 3. **Lấy danh sách danh mục**
```http
GET /api/public/categories
```

**Parameters:**
- `page` (int, default: 0): Số trang
- `size` (int, default: 50): Số danh mục/trang

**Response:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Lấy danh sách danh mục thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Điện tử",
        "description": "Sản phẩm điện tử",
        "imageUrl": "http://..."
      }
    ],
    "totalElements": 10,
    "totalPages": 1
  }
}
```

## 🎨 UI Components

### 1. **ProductCard Component**
```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToFavorite?: (product: Product) => void;
  showActions?: boolean;
  loading?: boolean;
}
```

**Features:**
- **Image handling** với error fallback
- **Stock badge** cho sản phẩm hết hàng
- **Quick actions** (hover effects)
- **Rating display** với stars
- **Responsive layout**

### 2. **Filter Sidebar**
- **Search box** với icon
- **Category dropdown**
- **Sort options**
- **Price range inputs**
- **Clear filters button**

### 3. **Product Grid**
- **Loading skeletons**
- **Empty state**
- **Error handling**
- **Pagination controls**

## 🔧 Cấu hình

### 1. **Environment Variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. **Material-UI Theme**
```tsx
// Responsive breakpoints
xs: 0,    // phone
sm: 600,  // tablets
md: 900,  // small laptop
lg: 1200, // desktop
xl: 1536  // large screens
```

### 3. **API Configuration**
```tsx
// Axios instance với interceptors
const api = getApiInstance();
```

## 🧪 Testing

### 1. **Test Cases**
- [ ] Load danh sách sản phẩm
- [ ] Filter theo danh mục
- [ ] Search theo tên
- [ ] Sort các trường
- [ ] Pagination
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states

### 2. **Manual Testing**
```bash
# Start frontend
cd foodflowui
npm run dev

# Start backend
cd foodflow
mvn spring-boot:run

# Test URLs
http://localhost:3000/product
http://localhost:3000/product?category=1
http://localhost:3000/product?name=phone
```

## 🐛 Troubleshooting

### 1. **Common Issues**

**Lỗi CORS:**
```java
// Kiểm tra CorsConfig.java
.allowedOriginPatterns("*")
```

**Lỗi JPA Specification:**
```java
// Đảm bảo ProductRepository extend JpaSpecificationExecutor
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product>
```

**Lỗi Rating calculation:**
```java
// Kiểm tra ReviewRepository có method
@Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
Double findAverageRatingByProductId(@Param("productId") Long productId);
```

### 2. **Debug Tips**
- **Browser DevTools**: Kiểm tra Network tab
- **Spring Boot Logs**: Kiểm tra console logs
- **React DevTools**: Inspect component state
- **Database**: Kiểm tra dữ liệu trực tiếp

## 📈 Performance

### 1. **Optimizations**
- **Lazy loading** cho images
- **Pagination** để giảm load
- **Caching** cho categories
- **Debounce** cho search input

### 2. **Monitoring**
- **API response time**
- **Image loading time**
- **Bundle size**
- **Memory usage**

## 🔄 Future Enhancements

### 1. **Planned Features**
- **Advanced filters** (brand, color, size)
- **Wishlist functionality**
- **Compare products**
- **Quick view modal**
- **Infinite scroll**

### 2. **Performance Improvements**
- **Image optimization**
- **Code splitting**
- **Service worker caching**
- **CDN integration**

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify API endpoints
3. Test với Postman
4. Check database data
5. Review network requests 