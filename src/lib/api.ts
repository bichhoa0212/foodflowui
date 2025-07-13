import axios from 'axios';

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    let requestData = undefined;
    if (config.data) {
      try {
        if (typeof config.data === 'string') {
          requestData = JSON.parse(config.data);
        } else {
          requestData = config.data;
        }
      } catch (error) {
        requestData = config.data; // Use as is if parsing fails
      }
    }
    
    console.log('🌐 [REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: requestData
    });
    
    return config;
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    // Log response details
    console.log('📡 [RESPONSE]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error details
    let errorData = undefined;
    if (error.response?.data) {
      try {
        if (typeof error.response.data === 'string') {
          errorData = JSON.parse(error.response.data);
        } else {
          errorData = error.response.data;
        }
      } catch (parseError) {
        errorData = error.response.data; // Use as is if parsing fails
      }
    }
    
    console.error('💥 [RESPONSE ERROR]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: errorData,
      message: error.message,
      code: error.code
    });
    
    if (error.response?.status === 401) {
      // Token hết hạn, thử refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('🔄 [TOKEN REFRESH] Attempting to refresh token...');
          const response = await api.post('/auth/refresh', {
            refreshToken: refreshToken,
          });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ [TOKEN REFRESH] Token refreshed successfully');
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh token cũng hết hạn, logout
          console.log('❌ [TOKEN REFRESH] Refresh failed, logging out...');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Test connection
  testConnection: async () => {
    try {
      console.log('🔍 [CONNECTION TEST] Testing connection to backend...');
      const response = await fetch('http://localhost:8080/api/auth/test');
      console.log('✅ [CONNECTION TEST] Backend is reachable');
      return response.ok;
    } catch (error) {
      console.error('❌ [CONNECTION TEST] Backend is not reachable:', error);
      return false;
    }
  },

  // Đăng ký
  register: (data: RegisterRequest) => {
    console.log('🚀 [REGISTER] Request Data:', JSON.stringify(data, null, 2));
    return api.post('/auth/register', data)
      .then(response => {
        console.log('✅ [REGISTER] Response:', JSON.stringify(response.data, null, 2));
        return response;
      })
      .catch(error => {
        console.error('❌ [REGISTER] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // Đăng nhập
  login: (data: AuthRequest) => {
    console.log('🚀 [LOGIN] Request Data:', JSON.stringify(data, null, 2));
    return api.post('/auth/login', data)
      .then(response => {
        console.log('✅ [LOGIN] Response:', JSON.stringify(response.data, null, 2));
        return response;
      })
      .catch(error => {
        console.error('❌ [LOGIN] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // Refresh token
  refreshToken: (data: RefreshTokenRequest) => {
    console.log('🚀 [REFRESH] Request Data:', JSON.stringify(data, null, 2));
    return api.post('/auth/refresh', data)
      .then(response => {
        console.log('✅ [REFRESH] Response:', JSON.stringify(response.data, null, 2));
        return response;
      })
      .catch(error => {
        console.error('❌ [REFRESH] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // Test endpoint
  test: () => {
    console.log('🚀 [TEST] Requesting test endpoint');
    return api.get('/auth/test')
      .then(response => {
        console.log('✅ [TEST] Response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ [TEST] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // CORS test
  corsTest: () => {
    console.log('🚀 [CORS] Requesting CORS test endpoint');
    return api.get('/auth/cors-test')
      .then(response => {
        console.log('✅ [CORS] Response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ [CORS] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // Get default users info
  getDefaultUsers: () => {
    console.log('🚀 [DEFAULT_USERS] Requesting default users info');
    return api.get('/auth/default-users')
      .then(response => {
        console.log('✅ [DEFAULT_USERS] Response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ [DEFAULT_USERS] Error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  // Generate checksum
  generateChecksum: (data: AuthRequest) => {
    console.log('🚀 [CHECKSUM] Request Data:', JSON.stringify(data, null, 2));
    return api.post('/auth/generate-checksum', data)
      .then(response => {
        console.log('✅ [CHECKSUM] Response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ [CHECKSUM] Error:', error.response?.data || error.message);
        throw error;
      });
  },
};

// Types
export interface RegisterRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  sex?: number;
  address?: string;
  dateOfBirth?: string;
  provider: string;
  providerUserId?: string;
  providerMetaData?: string;
  checksum?: string;
  language?: number;
  deviceName?: string;
}

export interface AuthRequest {
  provider: string;
  providerUserId: string;
  password: string;
  checksum?: string;
  language?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: {
    id: number;
    name: string;
    email: string;
    phone: string;
    roles: string[];
    permissions: string[];
  };
}

export default api; 