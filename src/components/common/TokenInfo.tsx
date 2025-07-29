"use client";

import React, { useState, useEffect } from 'react';
import { isTokenExpired, isTokenExpiringSoon, getTokenTimeRemaining, getUserInfo } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface TokenInfoProps {
  showDetails?: boolean;
  className?: string;
}

/**
 * Component hiển thị thông tin về token (dùng cho debug)
 * - Hiển thị trạng thái token
 * - Thời gian còn lại
 * - Thông tin user
 * - Nút refresh token
 */
export const TokenInfo: React.FC<TokenInfoProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(-1);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { checkTokenExpiry } = useAuth();

  useEffect(() => {
    const updateTokenInfo = () => {
      setTimeRemaining(getTokenTimeRemaining());
      setUserInfo(getUserInfo());
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval);
  }, []);

  const handleRefreshToken = async () => {
    await checkTokenExpiry();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 0) return 'Invalid';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (isTokenExpired()) return 'text-red-500';
    if (isTokenExpiringSoon()) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (isTokenExpired()) return 'Expired';
    if (isTokenExpiringSoon()) return 'Expiring Soon';
    return 'Valid';
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          Token: {getStatusText()}
        </div>
        {timeRemaining > 0 && (
          <div className="text-xs text-gray-500">
            ({formatTime(timeRemaining)})
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg bg-gray-50 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Token Information</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {timeRemaining > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Time Remaining:</span>
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        )}
        
        {userInfo && (
          <div className="mt-3">
            <div className="font-medium mb-2">User Info:</div>
            <div className="text-sm space-y-1">
              <div>ID: {userInfo.id}</div>
              <div>Name: {userInfo.name}</div>
              <div>Email: {userInfo.email}</div>
              <div>Roles: {userInfo.roles?.join(', ') || 'None'}</div>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={handleRefreshToken}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Refresh Token
          </button>
        </div>
      </div>
    </div>
  );
}; 