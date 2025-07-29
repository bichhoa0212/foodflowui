"use client";

import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';

interface AvatarDebugProps {
  avatarUrl?: string;
  profileData?: any;
}

/**
 * Component debug để kiểm tra avatar URL và thông tin profile
 * Dùng để debug vấn đề hiển thị avatar
 */
export const AvatarDebug: React.FC<AvatarDebugProps> = ({ avatarUrl, profileData }) => {
  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Avatar Debug Info
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2">
          <strong>Avatar URL:</strong> {avatarUrl || 'null/undefined'}
        </Typography>
        
        <Typography variant="body2">
          <strong>Avatar URL length:</strong> {avatarUrl?.length || 0}
        </Typography>
        
        <Typography variant="body2">
          <strong>Avatar URL valid:</strong> {avatarUrl ? 'Yes' : 'No'}
        </Typography>
        
        {avatarUrl && (
          <Typography variant="body2">
            <strong>Avatar URL starts with http:</strong> {avatarUrl.startsWith('http') ? 'Yes' : 'No'}
          </Typography>
        )}
        
        <Typography variant="body2">
          <strong>Profile Data:</strong> {profileData ? 'Available' : 'Not available'}
        </Typography>
        
        {profileData && (
          <Typography variant="body2">
            <strong>Profile Avatar:</strong> {profileData.avatar || 'null/undefined'}
          </Typography>
        )}
      </Box>
      
      {/* Test Avatar Display */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2">Test Avatar Display:</Typography>
        <Avatar
          src={avatarUrl}
          sx={{ width: 50, height: 50 }}
        >
          {avatarUrl ? '' : 'U'}
        </Avatar>
      </Box>
      
      {/* Test Image Element */}
      {avatarUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Test Image Element:
          </Typography>
          <img 
            src={avatarUrl} 
            alt="Avatar Test" 
            style={{ 
              width: 50, 
              height: 50, 
              objectFit: 'cover',
              border: '1px solid #ccc'
            }}
            onError={(e) => {
              console.error('Image failed to load:', avatarUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', avatarUrl);
            }}
          />
        </Box>
      )}
    </Paper>
  );
}; 