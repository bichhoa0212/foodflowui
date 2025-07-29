# Category API Guide - Hướng dẫn sử dụng Category API

## 🎯 Tổng quan

`categoryApi.ts` cung cấp các function để tương tác với API categories từ backend Spring Boot.

## 📁 File Location

```
foodflowui/src/lib/categoryApi.ts
```

## 🔌 API Endpoints

### Backend Endpoints (Spring Boot)
```java
@RestController
@RequestMapping("/api/categories")
public class ApiCatergoryController {
    
    @GetMapping("/list")           // Lấy tất cả categories
    @GetMapping                    // Lấy categories với pagination
    @GetMapping("/{id}")           // Lấy chi tiết category
}
```

### Frontend API Calls
```typescript
import { categoryAPI, Category } from '@/lib/categoryApi';
```

## 📋 Interfaces

### Category Interface
```typescript
interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}
```

### CategoryResponse Interface
```typescript
interface CategoryResponse {
  content: Category[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
```

## 🚀 API Functions

### 1. **getAllCategories()**
Lấy danh sách tất cả danh mục (không phân trang)

```typescript
const response = await categoryAPI.getAllCategories();
const categories: Category[] = response.data.data;
```

**Backend Endpoint:** `GET /api/categories/list`

**Response:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Lấy danh sách loại sản phẩm thành công",
  "data": [
    {
      "id": 1,
      "name": "Điện tử",
      "description": "Sản phẩm điện tử",
      "imageUrl": "http://..."
    }
  ]
}
```

### 2. **getCategories(page, size)**
Lấy danh sách danh mục với phân trang

```typescript
const response = await categoryAPI.getCategories(0, 50);
const categoryResponse: CategoryResponse = response.data.data;
```

**Backend Endpoint:** `GET /api/categories?page=0&size=50`

**Parameters:**
- `page` (number, default: 0): Số trang (0-based)
- `size` (number, default: 50): Số lượng mỗi trang

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
    "totalPages": 1,
    "size": 50,
    "number": 0
  }
}
```

### 3. **getCategoryById(id)**
Lấy chi tiết danh mục theo ID

```typescript
const response = await categoryAPI.getCategoryById(1);
const category: Category = response.data.data;
```

**Backend Endpoint:** `GET /api/categories/{id}`

### 4. **getProductsByCategory(categoryId, page, size)**
Lấy danh sách sản phẩm theo danh mục

```typescript
const response = await categoryAPI.getProductsByCategory(1, 0, 12);
const products = response.data.data;
```

**Backend Endpoint:** `GET /api/products?categoryId=1&page=0&size=12`

## 🛠️ Helper Functions

### 1. **getCategoriesWithAuth(page, size)**
Helper function để lấy categories với authentication

```typescript
import { getCategoriesWithAuth } from '@/lib/categoryApi';

const categories = await getCategoriesWithAuth(0, 50);
```

### 2. **getAllCategoriesList()**
Helper function để lấy tất cả categories không phân trang

```typescript
import { getAllCategoriesList } from '@/lib/categoryApi';

const categories = await getAllCategoriesList();
```

### 3. **getCategories() (Deprecated)**
Helper function cũ sử dụng fetch (không khuyến khích)

```typescript
import { getCategories } from '@/lib/categoryApi';

const response = await getCategories(0, 50);
```

## 📝 Usage Examples

### 1. **Trong Component React**
```tsx
import React, { useState, useEffect } from 'react';
import { categoryAPI, Category } from '@/lib/categoryApi';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getAllCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {categories.map(category => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 2. **Trong Navbar Component**
```tsx
import { categoryAPI, Category } from '../lib/categoryApi';

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Render categories dropdown
};
```

### 3. **Trong Product Page**
```tsx
import { categoryAPI, Category } from '@/lib/categoryApi';

const ProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Render category filter dropdown
};
```

## 🔧 Configuration

### 1. **Axios Instance**
Category API sử dụng axios instance chung từ `baseApi.ts`:

```typescript
import { getApiInstance } from './baseApi';
const api = getApiInstance();
```

### 2. **Authentication**
- Tất cả API calls đều sử dụng axios instance với interceptors
- Tự động thêm Authorization header nếu có token
- Tự động refresh token nếu cần

### 3. **Error Handling**
```typescript
try {
  const response = await categoryAPI.getAllCategories();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

## 🧪 Testing

### 1. **Test API Endpoints**
```bash
# Test getAllCategories
curl -X GET http://localhost:8080/api/categories/list

# Test getCategories with pagination
curl -X GET "http://localhost:8080/api/categories?page=0&size=10"

# Test getCategoryById
curl -X GET http://localhost:8080/api/categories/1
```

### 2. **Test Frontend Functions**
```typescript
// Test trong browser console
import { categoryAPI } from '@/lib/categoryApi';

// Test getAllCategories
categoryAPI.getAllCategories().then(response => {
  console.log('Categories:', response.data.data);
});

// Test getCategories with pagination
categoryAPI.getCategories(0, 5).then(response => {
  console.log('Paginated categories:', response.data.data);
});
```

## 🐛 Troubleshooting

### 1. **Common Issues**

**Lỗi CORS:**
```bash
# Kiểm tra backend CORS configuration
.allowedOriginPatterns("*")
```

**Lỗi Authentication:**
```typescript
// Kiểm tra token trong localStorage
console.log('Token:', localStorage.getItem('accessToken'));
```

**Lỗi Network:**
```typescript
// Kiểm tra API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### 2. **Debug Tips**
- **Browser DevTools**: Kiểm tra Network tab
- **Console Logs**: Kiểm tra error messages
- **Postman**: Test API endpoints trực tiếp
- **React DevTools**: Inspect component state

## 📈 Performance

### 1. **Optimizations**
- **Caching**: Categories ít thay đổi, có thể cache
- **Lazy Loading**: Load categories khi cần
- **Pagination**: Sử dụng pagination cho danh sách lớn

### 2. **Best Practices**
- **Error Handling**: Luôn wrap API calls trong try-catch
- **Loading States**: Hiển thị loading khi đang fetch
- **Type Safety**: Sử dụng TypeScript interfaces

## 🔄 Migration từ productApi

### Trước (cũ):
```typescript
import { getCategories } from '@/lib/productApi';

const response = await getCategories();
const categories = response.content;
```

### Sau (mới):
```typescript
import { categoryAPI } from '@/lib/categoryApi';

const response = await categoryAPI.getAllCategories();
const categories = response.data.data;
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify API endpoints
3. Test với Postman
4. Check authentication
5. Review network requests 