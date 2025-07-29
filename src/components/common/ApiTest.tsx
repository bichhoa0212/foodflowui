"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import { productAPI } from '@/lib/productApi';
import { categoryAPI } from '@/lib/category';

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testProductsAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing Products API...');
      const response = await productAPI.testProductsAPI();
      console.log('Products API Response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('Products API Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testCategoriesAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing Categories API...');
      const response = await categoryAPI.getAllCategories();
      console.log('Categories API Response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('Categories API Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testProductsWithParams = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing Products API with params...');
      const response = await productAPI.getProducts({
        page: 0,
        size: 5,
        sort: 'name,asc'
      });
      console.log('Products API with params Response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('Products API with params Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Test Component
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testProductsAPI}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Test Products API
          </Button>
          
          <Button 
            variant="contained" 
            onClick={testCategoriesAPI}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Test Categories API
          </Button>
          
          <Button 
            variant="contained" 
            onClick={testProductsWithParams}
            disabled={loading}
          >
            Test Products with Params
          </Button>
        </Box>

        {loading && (
          <Alert severity="info">Đang test API...</Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              API Response:
            </Typography>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTest; 