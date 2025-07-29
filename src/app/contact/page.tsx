"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  CheckCircle,
  Support,
  Business,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Điện thoại',
      content: '1900-1234',
      subtitle: 'Hỗ trợ 24/7',
      color: 'primary.main',
    },
    {
      icon: <Email />,
      title: 'Email',
      content: 'support@flowmart.com',
      subtitle: 'Phản hồi trong 2 giờ',
      color: 'success.main',
    },
    {
      icon: <LocationOn />,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      subtitle: 'Trụ sở chính',
      color: 'error.main',
    },
    {
      icon: <AccessTime />,
      title: 'Giờ làm việc',
      content: '7:00 - 22:00',
      subtitle: 'Thứ 2 - Chủ nhật',
      color: 'warning.main',
    },
  ];

  const departments = [
    {
      name: 'Hỗ trợ khách hàng',
      description: 'Giải đáp thắc mắc về sản phẩm và dịch vụ',
      email: 'support@flowmart.com',
      phone: '1900-1234',
    },
    {
      name: 'Kinh doanh',
      description: 'Hợp tác kinh doanh và đối tác',
      email: 'business@flowmart.com',
      phone: '1900-1235',
    },
    {
      name: 'Marketing',
      description: 'Quảng cáo và truyền thông',
      email: 'marketing@flowmart.com',
      phone: '1900-1236',
    },
    {
      name: 'Kỹ thuật',
      description: 'Hỗ trợ kỹ thuật và báo lỗi',
      email: 'tech@flowmart.com',
      phone: '1900-1237',
    },
  ];

  const socialMedia = [
    { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com/flowmart', color: '#1877f2' },
    { name: 'Instagram', icon: <Instagram />, url: 'https://instagram.com/flowmart', color: '#e4405f' },
    { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com/flowmart', color: '#1da1f2' },
    { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com/company/flowmart', color: '#0077b5' },
    { name: 'WhatsApp', icon: <WhatsApp />, url: 'https://wa.me/84901234567', color: '#25d366' },
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setShowError(true);
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', formData);
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📞 Liên hệ chúng tôi
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Gửi tin nhắn cho chúng tôi
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={formData.subject}
                      label="Chủ đề"
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                    >
                      <MenuItem value="">Chọn chủ đề</MenuItem>
                      <MenuItem value="support">Hỗ trợ khách hàng</MenuItem>
                      <MenuItem value="business">Hợp tác kinh doanh</MenuItem>
                      <MenuItem value="complaint">Khiếu nại</MenuItem>
                      <MenuItem value="suggestion">Đề xuất</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nội dung tin nhắn *"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{ minWidth: 200 }}
                  >
                    Gửi tin nhắn
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>

        {/* Contact Info Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Contact Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                📍 Thông tin liên hệ
              </Typography>
              <List>
                {contactInfo.map((info, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
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
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                🌐 Kết nối với chúng tôi
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {socialMedia.map((social) => (
                  <Button
                    key={social.name}
                    variant="outlined"
                    startIcon={social.icon}
                    sx={{ 
                      mb: 1,
                      borderColor: social.color,
                      color: social.color,
                      '&:hover': {
                        backgroundColor: social.color,
                        color: 'white',
                        borderColor: social.color,
                      }
                    }}
                  >
                    {social.name}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Support */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                🚀 Hỗ trợ nhanh
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Support />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Chat với CSKH
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Gọi ngay: 1900-1234
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  WhatsApp
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Departments Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
          🏢 Các phòng ban
        </Typography>
        <Grid container spacing={3}>
          {departments.map((dept, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {index === 0 && <Support sx={{ fontSize: 48, color: 'primary.main' }} />}
                    {index === 1 && <Business sx={{ fontSize: 48, color: 'success.main' }} />}
                    {index === 2 && <Support sx={{ fontSize: 48, color: 'warning.main' }} />}
                    {index === 3 && <Support sx={{ fontSize: 48, color: 'error.main' }} />}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {dept.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {dept.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" color="primary">
                      📧 {dept.email}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      📞 {dept.phone}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
          ❓ Câu hỏi thường gặp
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Làm thế nào để đặt hàng?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bạn có thể đặt hàng qua website, ứng dụng mobile hoặc gọi điện thoại đến hotline 1900-1234.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Thời gian giao hàng là bao lâu?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chúng tôi giao hàng trong vòng 2-4 giờ tại TP.HCM và Hà Nội, các tỉnh khác từ 1-3 ngày.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Có thể đổi trả sản phẩm không?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Có, chúng tôi chấp nhận đổi trả trong vòng 24h nếu sản phẩm có vấn đề về chất lượng.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Có chương trình khuyến mãi không?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chúng tôi thường xuyên có các chương trình khuyến mãi và mã giảm giá cho khách hàng.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Map Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
          🗺️ Bản đồ
        </Typography>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                height: 400,
                backgroundColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Bản đồ sẽ được hiển thị tại đây
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckCircle />}
        >
          Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          Vui lòng điền đầy đủ thông tin bắt buộc!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 