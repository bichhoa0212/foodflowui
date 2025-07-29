# Sửa lỗi Hydration - Trang Contact FlowMart

## 🐛 Vấn đề gặp phải

### Lỗi Hydration Error:
```
In HTML, <div> cannot be a descendant of <p>.
This will cause a hydration error.
```

### Nguyên nhân:
- `ListItemText` component của Material-UI render `secondary` prop như `<p>` tag
- Trong `secondary` prop có sử dụng `Box` component (render như `<div>`)
- HTML không cho phép `<div>` là con của `<p>`

## 🔧 Cách sửa lỗi (Giải pháp cuối cùng)

### Thay thế hoàn toàn ListItemText bằng custom layout

**Trước khi sửa:**
```tsx
<ListItemText
  primary={
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
      {info.content}
    </Typography>
  }
  secondary={
    <Box>  {/* ❌ Box render như <div> */}
      <Typography variant="body2" color="text.secondary">
        {info.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {info.subtitle}
      </Typography>
    </Box>
  }
/>
```

**Sau khi sửa:**
```tsx
<Box sx={{ flex: 1 }}>
  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
    {info.content}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    {info.title}
  </Typography>
  <Typography variant="caption" color="text.secondary">
    {info.subtitle}
  </Typography>
</Box>
```

### Layout hoàn chỉnh:
```tsx
<ListItem sx={{ px: 0 }}>
  <ListItemIcon>
    <Box sx={{ 
      p: 1, 
      borderRadius: 1, 
      backgroundColor: info.color,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {info.icon}
    </Box>
  </ListItemIcon>
  <Box sx={{ flex: 1 }}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
      {info.content}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {info.title}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {info.subtitle}
    </Typography>
  </Box>
</ListItem>
```

## 📋 Các thay đổi đã thực hiện

### ✅ Đã sửa:
1. **Loại bỏ ListItemText hoàn toàn** - Thay bằng custom layout
2. **Sử dụng Box với Typography** - Không có conflict với HTML rules
3. **Xóa import không sử dụng** - ListItemText và TextareaAutosize
4. **Giữ nguyên styling** - Layout và appearance không thay đổi

### ✅ Kết quả:
- Không còn lỗi hydration
- Trang contact hoạt động bình thường
- UI hiển thị đúng như thiết kế
- Performance tốt hơn (ít component hơn)

## 🎯 Best Practices

### Khi gặp lỗi hydration với Material-UI:

1. **Tránh JSX trong ListItemText secondary prop**
2. **Sử dụng custom layout thay vì ListItemText phức tạp**
3. **Kiểm tra HTML structure trước khi render**

### Ví dụ đúng:
```tsx
// ✅ Đúng - Custom layout
<ListItem>
  <ListItemIcon>...</ListItemIcon>
  <Box sx={{ flex: 1 }}>
    <Typography>Primary text</Typography>
    <Typography variant="body2">Secondary text</Typography>
  </Box>
</ListItem>

// ✅ Đúng - Simple ListItemText
<ListItemText
  primary="Simple text"
  secondary="Simple secondary text"
/>

// ❌ Sai - Complex JSX in secondary
<ListItemText
  primary={<Typography>Text</Typography>}
  secondary={<Box><Typography>Text</Typography></Box>}
/>
```

## 🧪 Testing

### Kiểm tra sau khi sửa:
1. **Không có lỗi hydration trong console**
2. **Trang contact load bình thường**
3. **Contact info hiển thị đúng**
4. **Form hoạt động bình thường**
5. **Responsive design vẫn tốt**

### Console logs cần kiểm tra:
```javascript
// Không có lỗi này:
// "In HTML, <div> cannot be a descendant of <p>"
```

## 🔍 Debug Tips

### Nếu vẫn có lỗi hydration:

1. **Kiểm tra tất cả Material-UI components**
2. **Tìm nested div trong p tags**
3. **Sử dụng React DevTools để inspect DOM**
4. **Kiểm tra Material-UI version compatibility**

### Common patterns gây lỗi:
```tsx
// ❌ Tránh
<ListItemText secondary={<Box>...</Box>} />
<ListItemText secondary={<div>...</div>} />

// ✅ Sử dụng
<Box>
  <Typography>Text 1</Typography>
  <Typography>Text 2</Typography>
</Box>
```

## 📚 Tài liệu tham khảo

- [Next.js Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)
- [Material-UI ListItemText](https://mui.com/material-ui/api/list-item-text/)
- [React Fragment](https://react.dev/reference/react/Fragment)

---

## 🎉 Kết luận

Lỗi hydration đã được khắc phục hoàn toàn bằng cách thay thế `ListItemText` bằng custom layout. Trang contact bây giờ hoạt động ổn định và không có lỗi console. Giải pháp này cũng cải thiện performance và maintainability. 