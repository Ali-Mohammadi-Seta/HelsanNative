// src/lib/api/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { getAccessToken, getRefreshToken, removeTokens, saveAccessToken } from '../auth/tokenStorage';
import config from '@/config';

// --- Configuration ---
const BASE_URL = config.apiUrl;
const REFRESH_TOKEN_ENDPOINT = '/auth/token';

// --- Axios Instance ---
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Client': 'phone',
  },
});

// --- Logging (dev only) ---
const isDev = process.env.NODE_ENV === 'development';
const log = {
  req: (req: AxiosRequestConfig) => {
    if (!isDev) return;
    const fullUrl = `${req.baseURL || apiClient.defaults.baseURL}${req.url}`;
    console.log('➡️ [API REQUEST]', req.method?.toUpperCase(), fullUrl, 'Headers:', JSON.stringify(req.headers));
  },
  res: (res: AxiosResponse) => {
    if (!isDev) return;
    const fullUrl = `${res.config.baseURL || ''}${res.config.url || ''}`;
    console.log('✅ [API RESPONSE]', fullUrl, res.status);
  },
  err: (err: AxiosError) => {
    if (!isDev) return;
    if (err.response) {
      const fullUrl = `${err.config?.baseURL || ''}${err.config?.url || ''}`;
      console.log('❌ [API ERROR]', fullUrl, err.response.status, JSON.stringify(err.response.data));
    } else {
      console.log('❌ [API ERROR] Network/setup:', err.message);
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

// --- Response Interceptor (401/403 → refresh) ---
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
      // don’t refresh if we are already calling refresh
      (originalRequest.url ?? '').indexOf(REFRESH_TOKEN_ENDPOINT) === -1;

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

      // 🔁 Match web: POST /auth/token with body { refreshToken }
      const { data } = await axios.post<{ data?: { accessToken: string } }>(
        `${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
        { refreshToken },
        { headers: { 'X-App-Client': 'phone', 'Content-Type': 'application/json' } }
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
      // go to auth entry; keep this consistent with your stacks
      router.replace('/(auth)');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
