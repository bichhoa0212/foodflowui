"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Pagination,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  AccessTime,
  Person,
  Category,
} from '@mui/icons-material';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  tags: string[];
  featured: boolean;
}

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "Xu hướng thực phẩm organic năm 2024",
    summary: "Khám phá những xu hướng thực phẩm organic mới nhất và cách chúng ảnh hưởng đến thói quen ăn uống của người Việt",
    content: "Năm 2024 chứng kiến sự bùng nổ của xu hướng thực phẩm organic tại Việt Nam...",
    image: "/images/news/organic-food.jpg",
    category: "Xu hướng",
    author: "Nguyễn Thị A",
    publishDate: "2024-01-15",
    readTime: 5,
    views: 1250,
    likes: 89,
    tags: ["Organic", "Xu hướng", "Sức khỏe"],
    featured: true,
  },
  {
    id: 2,
    title: "Cách chọn thực phẩm tươi ngon cho gia đình",
    summary: "Hướng dẫn chi tiết cách lựa chọn thực phẩm tươi ngon, an toàn cho bữa ăn gia đình",
    content: "Việc lựa chọn thực phẩm tươi ngon là yếu tố quan trọng để có những bữa ăn ngon...",
    image: "/images/news/fresh-food.jpg",
    category: "Hướng dẫn",
    author: "Trần Văn B",
    publishDate: "2024-01-12",
    readTime: 8,
    views: 980,
    likes: 67,
    tags: ["Thực phẩm", "Hướng dẫn", "Gia đình"],
    featured: false,
  },
  {
    id: 3,
    title: "Công nghệ bảo quản thực phẩm hiện đại",
    summary: "Tìm hiểu về các công nghệ bảo quản thực phẩm tiên tiến đang được áp dụng tại FlowMart",
    content: "Với sự phát triển của công nghệ, các phương pháp bảo quản thực phẩm ngày càng hiện đại...",
    image: "/images/news/food-preservation.jpg",
    category: "Công nghệ",
    author: "Lê Thị C",
    publishDate: "2024-01-10",
    readTime: 6,
    views: 756,
    likes: 45,
    tags: ["Công nghệ", "Bảo quản", "FlowMart"],
    featured: false,
  },
  {
    id: 4,
    title: "Thực đơn healthy cho tuần mới",
    summary: "Gợi ý thực đơn healthy 7 ngày giúp bạn và gia đình có những bữa ăn ngon, bổ dưỡng",
    content: "Bắt đầu tuần mới với những bữa ăn healthy không chỉ giúp cơ thể khỏe mạnh...",
    image: "/images/news/healthy-menu.jpg",
    category: "Thực đơn",
    author: "Phạm Văn D",
    publishDate: "2024-01-08",
    readTime: 10,
    views: 1120,
    likes: 78,
    tags: ["Healthy", "Thực đơn", "Dinh dưỡng"],
    featured: true,
  },
  {
    id: 5,
    title: "Tác động của thực phẩm đến sức khỏe tinh thần",
    summary: "Nghiên cứu mới về mối liên hệ giữa chế độ ăn uống và sức khỏe tinh thần",
    content: "Nhiều nghiên cứu gần đây cho thấy thực phẩm không chỉ ảnh hưởng đến sức khỏe thể chất...",
    image: "/images/news/mental-health.jpg",
    category: "Sức khỏe",
    author: "Hoàng Thị E",
    publishDate: "2024-01-05",
    readTime: 7,
    views: 890,
    likes: 56,
    tags: ["Sức khỏe", "Tinh thần", "Nghiên cứu"],
    featured: false,
  },
  {
    id: 6,
    title: "Cách tiết kiệm chi phí mua thực phẩm",
    summary: "Những mẹo hay giúp bạn tiết kiệm chi phí khi mua sắm thực phẩm mà vẫn đảm bảo chất lượng",
    content: "Mua sắm thực phẩm thông minh không chỉ giúp tiết kiệm chi phí mà còn đảm bảo...",
    image: "/images/news/save-money.jpg",
    category: "Tiết kiệm",
    author: "Vũ Văn F",
    publishDate: "2024-01-03",
    readTime: 4,
    views: 1340,
    likes: 92,
    tags: ["Tiết kiệm", "Chi phí", "Mẹo hay"],
    featured: false,
  },
];

const categories = ['Tất cả', 'Xu hướng', 'Hướng dẫn', 'Công nghệ', 'Thực đơn', 'Sức khỏe', 'Tiết kiệm'];

const NewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedTab, setSelectedTab] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredNews = mockNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    
    // Filter by tab
    let matchesTab = true;
    if (selectedTab === 1) { // Nổi bật
      matchesTab = article.featured;
    } else if (selectedTab === 2) { // Mới nhất
      const articleDate = new Date(article.publishDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTab = articleDate >= weekAgo;
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const featuredNews = mockNews.filter(article => article.featured);
  const popularNews = [...mockNews].sort((a, b) => b.views - a.views).slice(0, 5);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handleToggleFavorite = (articleId: number) => {
    setFavorites(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleToggleBookmark = (articleId: number) => {
    setBookmarks(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📰 Tin tức & Cập nhật
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Cập nhật những tin tức mới nhất về thực phẩm, sức khỏe và xu hướng ẩm thực
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm tin tức..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // Reset to first page when category changes
                  }}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Tất cả" />
              <Tab label="Nổi bật" />
              <Tab label="Mới nhất" />
            </Tabs>
          </Box>

          {/* News Grid */}
          <Grid container spacing={3}>
            {paginatedNews.map((article) => (
              <Grid item xs={12} md={6} key={article.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Category and Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={article.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(article.id)}
                        >
                          {favorites.includes(article.id) ? (
                            <Favorite color="error" fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleBookmark(article.id)}
                        >
                          {bookmarks.includes(article.id) ? (
                            <Bookmark color="primary" fontSize="small" />
                          ) : (
                            <BookmarkBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {article.title}
                    </Typography>

                    {/* Summary */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {article.summary}
                    </Typography>

                    {/* Meta Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">
                          {article.readTime} phút đọc
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp fontSize="small" />
                        <Typography variant="caption">
                          {article.views} lượt xem
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      {article.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>

                    {/* Author and Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        <Typography variant="caption">
                          {article.author}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(article.publishDate)}
                      </Typography>
                    </Box>

                    {/* Read More Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2, alignSelf: 'flex-start' }}
                    >
                      Đọc thêm
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredNews.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredNews.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Featured News */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                🏆 Tin nổi bật
              </Typography>
              <List>
                {featuredNews.map((article) => (
                  <ListItem key={article.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={article.image}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {article.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(article.publishDate)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <TrendingUp fontSize="small" />
                            <Typography variant="caption">
                              {article.views} lượt xem
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Popular News */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                🔥 Tin phổ biến
              </Typography>
              <List>
                {popularNews.map((article, index) => (
                  <ListItem key={article.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            {index + 1}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {article.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(article.publishDate)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {article.views} lượt xem
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                📂 Danh mục
              </Typography>
              <List>
                {categories.slice(1).map((category) => (
                  <ListItem 
                    key={category} 
                    sx={{ px: 0, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1); // Reset to first page when category changes
                    }}
                  >
                    <ListItemText
                      primary={category}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsPage; 