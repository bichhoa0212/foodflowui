# Category Module Structure - Hướng dẫn cấu trúc thư mục Category

## 🎯 Tổng quan

Tất cả các file liên quan đến Category đã được tổ chức vào thư mục riêng biệt để dễ quản lý và maintain.

## 📁 Cấu trúc thư mục

```
foodflowui/src/
├── lib/
│   └── category/
│       ├── index.ts              # Export tất cả từ category module
│       └── categoryApi.ts        # API functions cho category
├── components/
│   └── category/
│       ├── index.ts              # Export tất cả components
│       ├── CategoryCard.tsx      # Component hiển thị 1 category
│       └── CategoryList.tsx      # Component hiển thị danh sách categories
└── app/
    └── category/
        └── page.tsx              # Trang hiển thị tất cả categories
```

## 🔧 Files và chức năng

### 1. **API Layer** (`/lib/category/`)

#### **categoryApi.ts**
```typescript
// API functions
export const categoryAPI = {
  getAllCategories: () => api.get('/categories/list'),
  getCategories: (page, size) => api.get('/categories?page=${page}&size=${size}'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getProductsByCategory: (categoryId, page, size) => api.get('/products?categoryId=${categoryId}'),
};

// Helper functions
export const getCategoriesWithAuth = async (page, size) => { ... };
export const getAllCategoriesList = async () => { ... };
```

#### **index.ts**
```typescript
export * from './categoryApi';
```

### 2. **Components Layer** (`/components/category/`)

#### **CategoryCard.tsx**
```typescript
interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
  loading?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
}
```

**Features:**
- ✅ Hiển thị hình ảnh danh mục
- ✅ Tên và mô tả danh mục
- ✅ Click handler để chuyển trang
- ✅ Loading state với skeleton
- ✅ Hover effects
- ✅ Responsive design

#### **CategoryList.tsx**
```typescript
interface CategoryListProps {
  onCategoryClick?: (category: Category) => void;
  showDescription?: boolean;
  showImage?: boolean;
  itemsPerPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  title?: string;
}
```

**Features:**
- ✅ Grid layout responsive
- ✅ Search functionality
- ✅ Pagination
- ✅ Loading states
- ✅ Error handling
- ✅ Empty state

#### **index.ts**
```typescript
export { default as CategoryCard } from './CategoryCard';
export { default as CategoryList } from './CategoryList';
```

### 3. **Pages Layer** (`/app/category/`)

#### **page.tsx**
```typescript
const CategoryPage: React.FC = () => {
  const handleCategoryClick = (category: Category) => {
    router.push(`/product?category=${category.id}`);
  };
  
  return (
    <Container>
      <Breadcrumbs />
      <Header />
      <CategoryList onCategoryClick={handleCategoryClick} />
    </Container>
  );
};
```

**Features:**
- ✅ Breadcrumbs navigation
- ✅ Page header với title
- ✅ CategoryList component
- ✅ Click handler để chuyển đến trang sản phẩm

## 🚀 Usage Examples

### 1. **Import từ category module**
```typescript
// Import API
import { categoryAPI, Category } from '@/lib/category';

// Import components
import { CategoryCard, CategoryList } from '@/components/category';
```

### 2. **Sử dụng CategoryCard**
```tsx
import { CategoryCard } from '@/components/category';

<CategoryCard
  category={category}
  onClick={(cat) => router.push(`/product?category=${cat.id}`)}
  showDescription={true}
  showImage={true}
/>
```

### 3. **Sử dụng CategoryList**
```tsx
import { CategoryList } from '@/components/category';

<CategoryList
  onCategoryClick={(category) => handleCategoryClick(category)}
  showDescription={true}
  showImage={true}
  itemsPerPage={12}
  showSearch={true}
  showPagination={true}
  title="Danh mục sản phẩm"
/>
```

### 4. **Sử dụng categoryAPI**
```typescript
import { categoryAPI } from '@/lib/category';

// Lấy tất cả categories
const response = await categoryAPI.getAllCategories();
const categories = response.data.data;

// Lấy categories với pagination
const response = await categoryAPI.getCategories(0, 50);
const categoryResponse = response.data.data;
```

## 📱 Responsive Design

### **CategoryCard**
- **Desktop**: 3-4 cards/hàng
- **Tablet**: 2-3 cards/hàng
- **Mobile**: 1-2 cards/hàng

### **CategoryList**
- **Grid**: Responsive grid với Material-UI
- **Search**: Full width trên mobile, max-width trên desktop
- **Pagination**: Centered với large size

## 🎨 Styling

### **CategoryCard Styling**
```typescript
sx={{
  cursor: onClick ? 'pointer' : 'default',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: onClick ? 'translateY(-2px)' : 'none',
    boxShadow: onClick ? 3 : 1,
  }
}}
```

### **CategoryList Styling**
```typescript
// Grid container
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <CategoryCard />
  </Grid>
</Grid>
```

## 🔄 Migration từ cấu trúc cũ

### **Trước (cũ):**
```typescript
import { categoryAPI, Category } from '@/lib/categoryApi';
```

### **Sau (mới):**
```typescript
import { categoryAPI, Category } from '@/lib/category';
```

### **Components:**
```typescript
// Trước
import CategoryCard from '@/components/CategoryCard';

// Sau
import { CategoryCard } from '@/components/category';
```

## 🧪 Testing

### **1. Test API Functions**
```typescript
// Test getAllCategories
const response = await categoryAPI.getAllCategories();
console.log('Categories:', response.data.data);

// Test getCategories with pagination
const response = await categoryAPI.getCategories(0, 5);
console.log('Paginated categories:', response.data.data);
```

### **2. Test Components**
```tsx
// Test CategoryCard
<CategoryCard
  category={{ id: 1, name: "Test Category", description: "Test Description" }}
  onClick={(cat) => console.log('Clicked:', cat)}
/>

// Test CategoryList
<CategoryList
  onCategoryClick={(cat) => console.log('Category clicked:', cat)}
  showSearch={true}
  showPagination={true}
/>
```

### **3. Test Pages**
```bash
# Test category page
http://localhost:3000/category

# Test navigation từ category đến product
http://localhost:3000/category -> Click category -> /product?category=1
```

## 📈 Benefits

### **1. Organization**
- ✅ Tất cả category-related code ở một nơi
- ✅ Dễ tìm và maintain
- ✅ Clear separation of concerns

### **2. Reusability**
- ✅ Components có thể tái sử dụng
- ✅ API functions standardized
- ✅ Consistent interfaces

### **3. Scalability**
- ✅ Dễ thêm features mới
- ✅ Dễ refactor
- ✅ Dễ test

### **4. Developer Experience**
- ✅ Clear import paths
- ✅ TypeScript support
- ✅ Consistent naming

## 🔧 Configuration

### **1. TypeScript Paths**
```json
{
  "compilerOptions": {
    "paths": {
      "@/lib/category": ["./src/lib/category"],
      "@/components/category": ["./src/components/category"]
    }
  }
}
```

### **2. Import Aliases**
```typescript
// Sử dụng alias
import { categoryAPI } from '@/lib/category';
import { CategoryCard } from '@/components/category';
```

## 🐛 Troubleshooting

### **1. Import Errors**
```bash
# Kiểm tra file exists
ls src/lib/category/
ls src/components/category/

# Kiểm tra index.ts files
cat src/lib/category/index.ts
cat src/components/category/index.ts
```

### **2. TypeScript Errors**
```bash
# Rebuild TypeScript
npm run build

# Check types
npx tsc --noEmit
```

### **3. Runtime Errors**
```bash
# Check console logs
# Check network requests
# Check component props
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra cấu trúc thư mục
2. Verify import paths
3. Check TypeScript compilation
4. Test API endpoints
5. Review component props 