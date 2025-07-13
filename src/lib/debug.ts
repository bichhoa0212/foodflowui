// Debug utilities for API testing

export const debugConfig = {
  backendUrl: 'http://localhost:8080/api',
  timeout: 10000,
};

export const logRequest = (method: string, url: string, data?: any) => {
  console.group(`🌐 [${method.toUpperCase()}] ${url}`);
  console.log('Request Data:', data);
  console.log('Full URL:', `${debugConfig.backendUrl}${url}`);
  console.groupEnd();
};

export const logResponse = (status: number, data: any) => {
  console.group(`📡 [RESPONSE] ${status}`);
  console.log('Response Data:', data);
  console.groupEnd();
};

export const logError = (error: any) => {
  console.group('❌ [ERROR]');
  console.error('Error Details:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    config: error.config,
  });
  console.groupEnd();
};

export const testBackendConnection = async () => {
  const testUrls = [
    'http://localhost:8080/api/auth/test',
    'http://localhost:8080/api/auth/cors-test',
    'http://localhost:8080/api/auth/default-users',
  ];

  console.group('🔍 [BACKEND CONNECTION TEST]');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log(`✅ ${url} - Status: ${response.status} - Data: ${data}`);
      } else {
        console.log(`❌ ${url} - Status: ${response.status} - ${response.statusText}`);
      }
    } catch (error: any) {
      console.log(`💥 ${url} - Error: ${error.message}`);
    }
  }
  
  console.groupEnd();
};

export const checkCORS = async () => {
  console.group('🔍 [CORS TEST]');
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/cors-test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log('CORS Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    if (response.ok) {
      const data = await response.text();
      console.log('CORS Data:', data);
    }
  } catch (error: any) {
    console.error('CORS Error:', error);
  }
  
  console.groupEnd();
};

export const validateLoginData = (data: any) => {
  console.group('🔍 [LOGIN DATA VALIDATION]');
  
  const required = ['provider', 'providerUserId', 'password'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required fields:', missing);
  } else {
    console.log('✅ All required fields present');
  }
  
  console.log('Data structure:', {
    provider: data.provider,
    providerUserId: data.providerUserId,
    password: data.password ? '[HIDDEN]' : undefined,
    checksum: data.checksum ? '[PRESENT]' : undefined,
    language: data.language,
  });
  
  console.log('Provider detection:', {
    input: data.providerUserId,
    detectedProvider: data.provider,
    isValidEmail: data.providerUserId && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.providerUserId),
    isValidPhone: data.providerUserId && /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(data.providerUserId),
  });
  
  console.groupEnd();
  
  return missing.length === 0;
};

export const validateRegisterData = (data: any) => {
  console.group('🔍 [REGISTER DATA VALIDATION]');
  
  const required = ['name', 'email', 'phone', 'password', 'provider', 'providerUserId'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required fields:', missing);
  } else {
    console.log('✅ All required fields present');
  }
  
  console.log('Data structure:', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password ? '[HIDDEN]' : undefined,
    provider: data.provider,
    providerUserId: data.providerUserId,
    checksum: data.checksum ? '[PRESENT]' : undefined,
    language: data.language,
  });
  
  console.log('Provider detection:', {
    email: data.email,
    phone: data.phone,
    detectedProvider: data.provider,
    isValidEmail: data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
    isValidPhone: data.phone && /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(data.phone),
  });
  
  console.groupEnd();
  
  return missing.length === 0;
}; 