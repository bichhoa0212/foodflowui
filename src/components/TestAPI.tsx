'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { authAPI, RegisterRequest, AuthRequest, AuthResponse, RefreshTokenRequest } from '@/lib/authApi';
import { generateChecksum, generateSimpleChecksum, validateEmail, validatePhone } from '@/lib/utils';
import { testBackendConnection, checkCORS, validateLoginData, validateRegisterData } from '@/lib/debug';

const TestAPI = () => {
  const [loginData, setLoginData] = useState({
    account: '0348236580',
    password: '123456',
  });
  
  const [useSecretKey, setUseSecretKey] = useState(false);
  
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const addResult = (test: string, result: any, isError = false) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result,
      isError,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Auto detect provider based on input format
  const detectProvider = (input: string): string => {
    if (validateEmail(input)) {
      return 'EMAIL';
    } else if (validatePhone(input)) {
      return 'PHONE';
    }
    return 'PHONE'; // Default to phone
  };

  const handleTestLogin = async () => {
    setLoading('login');
    try {
      const detectedProvider = detectProvider(loginData.account);
      const checksum = useSecretKey 
        ? generateChecksum(loginData.account, loginData.password)
        : generateSimpleChecksum(loginData.account, loginData.password);
      
      const data = {
        provider: detectedProvider,
        providerUserId: loginData.account,
        password: loginData.password,
        checksum,
        language: 1,
      };
      
      // Validate data before sending
      validateLoginData(data);
      
      const response = await authAPI.login(data);
      addResult('Login Test', response.data);
    } catch (error: any) {
      addResult('Login Test', error.response?.data || error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleTestRegister = async () => {
    setLoading('register');
    try {
      const testAccount = 'test@example.com'; // Có thể thay đổi thành số điện thoại
      const detectedProvider = detectProvider(testAccount);
      
      const registerData = {
        name: 'Test User',
        email: detectedProvider === 'EMAIL' ? testAccount : '',
        phone: detectedProvider === 'PHONE' ? testAccount : '',
        password: '123456',
        sex: 1,
        address: 'Test Address',
        dateOfBirth: '1990-01-01',
        provider: detectedProvider,
        providerUserId: testAccount,
        checksum: generateChecksum(testAccount, '123456'),
        language: 1,
        deviceName: 'Test Browser',
      };
      
      // Validate data before sending
      validateRegisterData(registerData);
      
      const response = await authAPI.register(registerData);
      addResult('Register Test', response.data);
    } catch (error: any) {
      addResult('Register Test', error.response?.data || error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleTestEndpoint = async (endpoint: string) => {
    setLoading(endpoint);
    try {
      let response;
      switch (endpoint) {
        case 'test':
          response = await authAPI.test();
          break;
        case 'cors':
          response = await authAPI.corsTest();
          break;
        case 'default-users':
          response = await authAPI.getDefaultUsers();
          break;
        default:
          throw new Error('Unknown endpoint');
      }
      addResult(`${endpoint.toUpperCase()} Test`, response.data);
    } catch (error: any) {
      addResult(`${endpoint.toUpperCase()} Test`, error.response?.data || error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateChecksum = async () => {
    setLoading('checksum');
    try {
      const detectedProvider = detectProvider(loginData.account);
      const data = {
        provider: detectedProvider,
        providerUserId: loginData.account,
        password: loginData.password,
        language: 1,
      };
      
      const response = await authAPI.generateChecksum(data);
      addResult('Generate Checksum', response.data);
    } catch (error: any) {
      addResult('Generate Checksum', error.response?.data || error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleTestConnection = async () => {
    setLoading('connection');
    try {
      const isConnected = await authAPI.testConnection();
      addResult('Connection Test', { 
        connected: isConnected, 
        message: isConnected ? 'Backend is reachable' : 'Backend is not reachable' 
      }, !isConnected);
    } catch (error: any) {
      addResult('Connection Test', error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleDebugBackend = async () => {
    setLoading('debug');
    try {
      await testBackendConnection();
      addResult('Debug Backend', { message: 'Check console for detailed results' });
    } catch (error: any) {
      addResult('Debug Backend', error.message, true);
    } finally {
      setLoading(null);
    }
  };

  const handleDebugCORS = async () => {
    setLoading('cors');
    try {
      await checkCORS();
      addResult('Debug CORS', { message: 'Check console for detailed results' });
    } catch (error: any) {
      addResult('Debug CORS', error.message, true);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Test Console
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Login Test
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Detected Provider</InputLabel>
            <Select
              value={detectProvider(loginData.account)}
              label="Detected Provider"
              disabled
            >
              <MenuItem value="PHONE">PHONE</MenuItem>
              <MenuItem value="EMAIL">EMAIL</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Tài khoản đăng nhập"
            value={loginData.account}
            onChange={(e) => setLoginData(prev => ({ ...prev, account: e.target.value }))}
            placeholder="0348236580 hoặc test@example.com"
          />
          
          <TextField
            label="Password"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={useSecretKey}
                onChange={(e) => setUseSecretKey(e.target.checked)}
              />
            }
            label="Use Secret Key in Checksum"
          />
          
          <Button
            variant="contained"
            onClick={handleTestLogin}
            disabled={loading === 'login'}
          >
            {loading === 'login' ? 'Testing...' : 'Test Login'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Other Tests
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleTestRegister}
            disabled={loading === 'register'}
          >
            {loading === 'register' ? 'Testing...' : 'Test Register'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleTestEndpoint('test')}
            disabled={loading === 'test'}
          >
            {loading === 'test' ? 'Testing...' : 'Test Endpoint'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleTestEndpoint('cors')}
            disabled={loading === 'cors'}
          >
            {loading === 'cors' ? 'Testing...' : 'CORS Test'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleTestEndpoint('default-users')}
            disabled={loading === 'default-users'}
          >
            {loading === 'default-users' ? 'Testing...' : 'Default Users'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleGenerateChecksum}
            disabled={loading === 'checksum'}
          >
            {loading === 'checksum' ? 'Testing...' : 'Generate Checksum'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleTestConnection}
            disabled={loading === 'connection'}
            color="secondary"
          >
            {loading === 'connection' ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleDebugBackend}
            disabled={loading === 'debug'}
            color="warning"
          >
            {loading === 'debug' ? 'Testing...' : 'Debug Backend'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleDebugCORS}
            disabled={loading === 'cors'}
            color="info"
          >
            {loading === 'cors' ? 'Testing...' : 'Debug CORS'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Results
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {testResults.length === 0 ? (
            <Typography color="text.secondary">
              No test results yet. Run a test to see the output.
            </Typography>
          ) : (
            testResults.map((result) => (
              <Box key={result.id} sx={{ mb: 2 }}>
                <Alert 
                  severity={result.isError ? 'error' : 'success'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    {result.test} - {result.timestamp}
                  </Typography>
                </Alert>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </Paper>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TestAPI; 