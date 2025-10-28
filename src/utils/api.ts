import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-59eb6dfe`;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API call failed: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  sendOTP: (phoneNumber: string) => 
    apiCall('/auth/send-otp', { method: 'POST', body: { phoneNumber } }),
  
  verifyOTP: (phoneNumber: string, otp: string) => 
    apiCall('/auth/verify-otp', { method: 'POST', body: { phoneNumber, otp } }),
  
  signUp: (phoneNumber: string, fullName: string, password: string) => 
    apiCall('/auth/signup', { method: 'POST', body: { phoneNumber, fullName, password } }),
  
  signIn: (phoneNumber: string, password: string) => 
    apiCall('/auth/signin', { method: 'POST', body: { phoneNumber, password } }),
  
  resetPassword: (phoneNumber: string, newPassword: string) => 
    apiCall('/auth/reset-password', { method: 'POST', body: { phoneNumber, newPassword } }),
  
  getCurrentUser: (token: string) => 
    apiCall('/auth/me', { token }),
  
  // Application endpoints
  submitApplication: (token: string, applicationData: any) => 
    apiCall('/applications', { method: 'POST', body: applicationData, token }),
  
  getApplications: (token: string) => 
    apiCall('/applications', { token }),
  
  // Document endpoints
  uploadDocument: (token: string, fileName: string, fileData: string, fileType: string) => 
    apiCall('/documents/upload', { 
      method: 'POST', 
      body: { fileName, fileData, fileType }, 
      token 
    }),
};
