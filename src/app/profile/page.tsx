'use client';

import React from 'react';
import Profile from '@/components/Profile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
};

export default ProfilePage; 