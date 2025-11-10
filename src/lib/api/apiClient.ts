import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { getAccessToken, getRefreshToken, removeTokens, saveAccessToken } from '../auth/tokenStorage';
import config from '@/config';

// --- Configuration ---
// ✅ Use the nginx proxy on local network
const BASE_URL = config.apiUrl; // http://192.168.1.69:8080/api
const REFRESH_TOKEN_ENDPOINT = '/auth/token';

// --- Axios Instance ---
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // ✅ Add timeout
  headers: {
    'Content-Type': 'application/json',
    'X-App-Client': 'phone',
  },
});

// --- Logging ---
const isDev = __DEV__;
const log = {
  req: (req: AxiosRequestConfig) => {
    if (!isDev) return;
    const fullUrl = `${req.baseURL}${req.url}`;
    console.log('➡️ [API REQUEST]', req.method?.toUpperCase(), fullUrl);
    console.log('   Headers:', JSON.stringify(req.headers, null, 2));
    if (req.data) console.log('   Body:', JSON.stringify(req.data, null, 2));
  },
  res: (res: AxiosResponse) => {
    if (!isDev) return;
    const fullUrl = `${res.config.baseURL}${res.config.url}`;
    console.log('✅ [API RESPONSE]', res.status, fullUrl);
    console.log('   Data:', JSON.stringify(res.data, null, 2));
  },
  err: (err: AxiosError) => {
    if (!isDev) return;
    if (err.response) {
      const fullUrl = `${err.config?.baseURL}${err.config?.url}`;
      console.log('❌ [API ERROR]', err.response.status, fullUrl);
      console.log('   Error:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
      console.log('❌ [API ERROR] No response received');
      console.log('   Request:', err.request);
    } else {
      console.log('❌ [API ERROR]', err.message);
    }
  },
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  async (cfg) => {
    const token = await getAccessToken();
    if (token) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    log.req(cfg);
    return cfg;
  },
  (error) => {
    log.err(error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
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

    const status = error.response?.status;
    const shouldTryRefresh =
      (status === 401 || status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(REFRESH_TOKEN_ENDPOINT);

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post<{ data?: { accessToken: string } }>(
        `${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
        { refreshToken },
        {
          headers: {
            'X-App-Client': 'phone',
            'Content-Type': 'application/json'
          }
        }
      );

      const accessToken = data?.data?.accessToken ?? (data as any)?.accessToken;
      if (!accessToken) throw new Error('No access token in refresh response');

      await saveAccessToken(accessToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      await removeTokens();
      router.replace('/(auth)');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;