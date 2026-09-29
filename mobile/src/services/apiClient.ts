import axios from 'axios';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

import * as SecureStore from 'expo-secure-store';

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
  } catch (error) {
    console.error('Error reading token from SecureStore', error);
  }
  return config;
});

class ApiClient {
  private async request<T>(method: string, endpoint: string, data?: any, headers?: any): Promise<T> {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        headers,
      });
      return { data: response.data } as any;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'An error occurred';
      console.error(`API Error on ${endpoint}:`, message);
      throw new Error(message);
    }
  }

  get<T>(endpoint: string, headers?: any) {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  post<T>(endpoint: string, data?: any, headers?: any) {
    let customHeaders = { ...headers };
    if (data instanceof FormData) {
      customHeaders['Content-Type'] = 'multipart/form-data';
    }
    return this.request<T>('POST', endpoint, data, customHeaders);
  }

  patch<T>(endpoint: string, data?: any, headers?: any) {
    let customHeaders = { ...headers };
    if (data instanceof FormData) {
      customHeaders['Content-Type'] = 'multipart/form-data';
    }
    return this.request<T>('PATCH', endpoint, data, customHeaders);
  }

  delete<T>(endpoint: string, headers?: any) {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }
}

export default new ApiClient();
