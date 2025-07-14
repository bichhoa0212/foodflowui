import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: 'grey.900',
      color: 'white',
      py: 6,
      mt: 'auto',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            FoodFlow
          </Typography>
          <Typography variant="body2">
            Nền tảng đặt đồ ăn trực tuyến hàng đầu Việt Nam, kết nối người dùng với hàng nghìn nhà hàng uy tín.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Liên kết
          </Typography>
          <Typography variant="body2" component="div">
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                  Về chúng tôi
                </Button>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                  Điều khoản sử dụng
                </Button>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                  Chính sách bảo mật
                </Button>
              </Box>
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Liên hệ
          </Typography>
          <Typography variant="body2">
            Email: support@foodflow.com<br />
            Hotline: 1900-xxxx<br />
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="grey.400">
          © 2024 FoodFlow. Tất cả quyền được bảo lưu.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer; 