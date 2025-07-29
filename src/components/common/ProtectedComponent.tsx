"use client";

import React, { useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useTokenCheck } from '@/hooks/useAuthGuard';
import { TokenInfo } from './TokenInfo';
import { authAPI } from '@/lib/authApi';

/**
 * Component ví dụ minh họa cách sử dụng hệ thống token management
 * - Sử dụng useAuthGuard để bảo vệ component
 * - Sử dụng useTokenCheck để kiểm tra token trước khi gửi API
 * - Hiển thị TokenInfo để debug
 */
export const ProtectedComponent: React.FC = () => {
  const { authenticated, loading } = useAuthGuard('/login');
  const { ensureValidToken } = useTokenCheck();
  const [apiResult, setApiResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Test API call với kiểm tra token
  const handleTestApi = async () => {
    setIsLoading(true);
    setApiResult('');

    try {
      // Kiểm tra token trước khi gửi request
      const isValid = await ensureValidToken();
      if (!isValid) {
        setApiResult('Token không hợp lệ, đã redirect về login');
        return;
      }

      // Gửi API request (interceptor sẽ tự động xử lý refresh nếu cần)
      const response = await authAPI.test();
      setApiResult(`API call thành công: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setApiResult(`API call thất bại: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test refresh token thủ công
  const handleManualRefresh = async () => {
    setIsLoading(true);
    setApiResult('');

    try {
      const isValid = await ensureValidToken();
      if (isValid) {
        setApiResult('Token đã được refresh thành công');
      } else {
        setApiResult('Refresh token thất bại');
      }
    } catch (error: any) {
      setApiResult(`Refresh thất bại: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang kiểm tra authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Sẽ redirect tự động
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Protected Component Example</h1>
        <p className="text-gray-600 mb-4">
          Component này minh họa cách sử dụng hệ thống token management.
        </p>

        {/* Token Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Token Information</h2>
          <TokenInfo showDetails={true} />
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Test API Calls</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleTestApi}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Đang gửi...' : 'Test API Call'}
              </button>

              <button
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Đang refresh...' : 'Manual Refresh Token'}
              </button>
            </div>
          </div>

          {/* API Result */}
          {apiResult && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Kết quả:</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                {apiResult}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Hướng dẫn sử dụng:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• <strong>useAuthGuard</strong>: Tự động bảo vệ component và redirect nếu chưa đăng nhập</li>
            <li>• <strong>useTokenCheck</strong>: Kiểm tra token trước khi gửi API request</li>
            <li>• <strong>Axios Interceptor</strong>: Tự động xử lý refresh token khi gặp lỗi 401</li>
            <li>• <strong>TokenInfo</strong>: Hiển thị thông tin token để debug</li>
          </ul>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Tính năng tự động:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>✓ Kiểm tra token khi component mount</li>
              <li>✓ Tự động refresh khi sắp hết hạn</li>
              <li>✓ Xử lý lỗi 401 tự động</li>
              <li>✓ Queue system tránh vòng lặp</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Bảo mật:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>✓ Tự động logout khi refresh thất bại</li>
              <li>✓ Redirect về login khi cần</li>
              <li>✓ Xử lý đa tab (sync localStorage)</li>
              <li>✓ Kiểm tra token định kỳ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 