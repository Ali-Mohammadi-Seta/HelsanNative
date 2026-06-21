import axios from 'axios';
import config from './config';
import { getAccessToken, removeTokens } from '@/lib/auth/tokenStorage';
import { router } from 'expo-router';

export const consultationApi = axios.create({
  baseURL: config.apiUrl,
  timeout: 8000,
});

consultationApi.interceptors.request.use(
  async (axiosConfig) => {
    const token = await getAccessToken(); 
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

consultationApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeTokens();
      router.replace('/(tabs)/home'); 
    }
    return Promise.reject(error);
  }
);
