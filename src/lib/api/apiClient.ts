// lib/api/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { getAccessToken, getRefreshToken, removeTokens, saveAccessToken } from '../auth/tokenStorage';

// --- Configuration ---
const BASE_URL = 'http://192.168.1.69:8080/api';
const REFRESH_TOKEN_ENDPOINT = '/auth/refresh';

console.log('🔧 [API CLIENT] Base URL:', BASE_URL);
// --- Axios Instance ---
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Client': 'phone',
  },
});

// --- Logging Helpers ---
const isDev = process.env.NODE_ENV === 'development';
const log = {
  req: (req: AxiosRequestConfig) => {
    if (isDev) {
      const fullUrl = `${req.baseURL || apiClient.defaults.baseURL}${req.url}`;
      console.log('➡️ [API REQUEST]', req.method?.toUpperCase(), fullUrl, 'Headers:', JSON.stringify(req.headers));
    }
  },
  res: (res: AxiosResponse) => {
    if (isDev) {
      const fullUrl = `${res.config.baseURL || ''}${res.config.url || ''}`;
      console.log('✅ [API RESPONSE]', fullUrl, res.status);
    }
  },
  err: (err: AxiosError) => {
    if (isDev) {
      if (err.response) {
        const fullUrl = `${err.config?.baseURL || ''}${err.config?.url || ''}`;
        console.log('❌ [API ERROR]', fullUrl, err.response.status, JSON.stringify(err.response.data));
      } else {
        console.log('❌ [API ERROR] Network or setup error:', err.message);
      }
    }
  },
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    log.req(config);
    return config;
  },
  (error) => {
    log.err(error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    log.res(response);
    return response;
  },
  async (error: AxiosError) => {
    log.err(error);
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        console.log("--- Refresh: USING REFRESH TOKEN ---");
        console.log(refreshToken);

        if (!refreshToken) {
          throw new Error('No refresh token available. User needs to log in again.');
        }

        // ✅ FIXED: Send refresh token in HEADER, not body
        const response = await axios.post(
          `${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
          {}, // Empty body
          {
            headers: {
              'X-App-Client': 'phone',
              'Authorization': `Bearer ${refreshToken}`, // Backend reads refresh token from here
            },
          }
        );

        const { accessToken } = response.data.data || response.data;

        await saveAccessToken(accessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        await removeTokens();
        router.replace('/(login)/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;