"use client";

import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Store,
  LocalShipping,
  People,
  TrendingUp,
  Star,
  CheckCircle,
  Business,
  EmojiEvents,
  Favorite,
  Security,
  Speed,
  Support,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Khách hàng', value: '50,000+', icon: <People /> },
    { label: 'Đơn hàng', value: '100,000+', icon: <LocalShipping /> },
    { label: 'Sản phẩm', value: '1,000+', icon: <Store /> },
    { label: 'Đánh giá', value: '4.8/5', icon: <Star /> },
  ];

  const values = [
    {
      title: 'Chất lượng',
      description: 'Cam kết cung cấp sản phẩm chất lượng cao, tươi mới',
      icon: <CheckCircle />,
      color: 'success.main',
    },
    {
      title: 'Tốc độ',
      description: 'Giao hàng nhanh chóng trong vòng 2-4 giờ',
      icon: <Speed />,
      color: 'primary.main',
    },
    {
      title: 'Uy tín',
      description: 'Xây dựng niềm tin với khách hàng qua từng đơn hàng',
      icon: <Security />,
      color: 'info.main',
    },
    {
      title: 'Hỗ trợ',
      description: 'Đội ngũ CSKH 24/7 sẵn sàng hỗ trợ mọi lúc',
      icon: <Support />,
      color: 'warning.main',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập',
      description: 'FlowMart được thành lập với mục tiêu mang đến trải nghiệm mua sắm thực phẩm tiện lợi',
    },
    {
      year: '2021',
      title: 'Mở rộng',
      description: 'Mở rộng dịch vụ giao hàng đến 10 quận tại TP.HCM',
    },
    {
      year: '2022',
      title: 'Phát triển',
      description: 'Ra mắt ứng dụng mobile và tích hợp thanh toán online',
    },
    {
      year: '2023',
      title: 'Bứt phá',
      description: 'Đạt 50,000+ khách hàng và mở rộng ra Hà Nội',
    },
    {
      year: '2024',
      title: 'Tương lai',
      description: 'Tiếp tục phát triển và mang đến nhiều giá trị hơn cho khách hàng',
    },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: '/images/team/ceo.jpg',
      description: '10+ năm kinh nghiệm trong lĩnh vực thương mại điện tử',
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: '/images/team/cto.jpg',
      description: 'Chuyên gia công nghệ với 8+ năm kinh nghiệm phát triển phần mềm',
    },
    {
      name: 'Lê Văn C',
      position: 'Head of Operations',
      avatar: '/images/team/operations.jpg',
      description: 'Quản lý vận hành với 12+ năm kinh nghiệm logistics',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🏪 Về FlowMart
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          Chúng tôi là nền tảng thương mại điện tử hàng đầu trong lĩnh vực thực phẩm tươi sống, 
          cam kết mang đến trải nghiệm mua sắm tiện lợi và chất lượng cho mọi gia đình Việt Nam.
        </Typography>
        <Button variant="contained" size="large" startIcon={<Store />}>
          Khám phá ngay
        </Button>
      </Box>

      {/* Stats Section */}
      <Paper sx={{ p: 4, mb: 6, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Những con số ấn tượng
        </Typography>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mission & Vision */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                🎯 Sứ mệnh
              </Typography>
              <Typography variant="body1" paragraph>
                FlowMart cam kết mang đến cho khách hàng những sản phẩm thực phẩm tươi ngon, 
                chất lượng cao với dịch vụ giao hàng nhanh chóng và tiện lợi.
              </Typography>
              <Typography variant="body1">
                Chúng tôi tin rằng mọi gia đình Việt Nam đều xứng đáng được thưởng thức 
                những bữa ăn ngon, bổ dưỡng với chi phí hợp lý.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                👁️ Tầm nhìn
              </Typography>
              <Typography variant="body1" paragraph>
                Trở thành nền tảng thương mại điện tử hàng đầu trong lĩnh vực thực phẩm 
                tại Việt Nam, với mạng lưới phủ sóng toàn quốc.
              </Typography>
              <Typography variant="body1">
                Chúng tôi mong muốn trở thành người bạn đồng hành tin cậy của mọi gia đình 
                trong việc lựa chọn và mua sắm thực phẩm hàng ngày.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Core Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Giá trị cốt lõi
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {React.cloneElement(value.icon, { 
                      sx: { fontSize: 48, color: value.color } 
                    })}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Timeline */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Hành trình phát triển
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {milestones.map((milestone, index) => (
            <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                minWidth: 100, 
                textAlign: 'center', 
                mr: 3,
                p: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                fontWeight: 'bold'
              }}>
                {milestone.year}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {milestone.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {milestone.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Đội ngũ lãnh đạo
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    src={member.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      fontSize: '3rem'
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {member.name}
                  </Typography>
                  <Chip 
                    label={member.position} 
                    color="primary" 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Awards & Recognition */}
      <Paper sx={{ p: 4, mb: 6, backgroundColor: 'grey.50' }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          🏆 Giải thưởng & Công nhận
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Top 10 E-commerce 2023
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Được vinh danh trong top 10 nền tảng thương mại điện tử hàng đầu Việt Nam
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Business sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Doanh nghiệp tiêu biểu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhận giải thưởng doanh nghiệp tiêu biểu trong lĩnh vực công nghệ
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Thương hiệu yêu thích
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Được khách hàng bình chọn là thương hiệu yêu thích nhất 2023
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', py: 6, backgroundColor: 'primary.main', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Hãy cùng chúng tôi xây dựng tương lai
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Tham gia cùng FlowMart để trải nghiệm dịch vụ mua sắm thực phẩm tiện lợi nhất
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            backgroundColor: 'white', 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'grey.100'
            }
          }}
        >
          Bắt đầu ngay
        </Button>
      </Box>
    </Container>
  );
};

export default AboutPage; 