import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "./config";
import endpoints from "./endpoints";
import * as pathRoute from "@/routes/pathRoutes";
import store from "@/redux/store";
import { setIsLoggedIn } from "@/redux/reducers/authReducer";
import { toast } from "@/components/toast/toastApi";

const base_url = config.apiUrl;

const defaultHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
});

/** آفلاین هستیم؟ */
const isOffline = () =>
  typeof navigator !== "undefined" && navigator.onLine === false;

const isNetworkError = (err: AxiosError) =>
  !err.response || err.code === "ERR_NETWORK";

/** این درخواست برای صف آفلاین واجد شرایط است؟ (با SW هم‌سو) */
const isOfflineQueueEligible = (url?: string, method?: string) => {
  if (!url) return false;
  const full = url.startsWith("http") ? url : base_url + url;
  const u = new URL(full);

  const isProd = u.hostname === "inhso.ir" && u.protocol === "https:";
  const isLocal =
    (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
    (u.protocol === "http:" || u.protocol === "https:");

  // ⚠️ با sw.ts یکی بماند:
  const allowedPath = /^\/api\/user\/(login|auth\/token)$/.test(u.pathname);

  const m = (method || "GET").toUpperCase();
  return m !== "GET" && allowedPath && (isProd || isLocal);
};

/** فقط ایونت بفرست؛ توست در App.tsx نمایش داده می‌شود */
const notifyQueued = (cfg?: AxiosRequestConfig) => {
  window.dispatchEvent(
    new CustomEvent("api:queued", {
      detail: { url: cfg?.url, method: cfg?.method },
    })
  );
};

// ===== Interceptors =====
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// صف‌بندی توکن رفرش
interface FailedApiPromise {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}
let isRefreshTokenFetching = false;
let failedApis: FailedApiPromise[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedApis.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedApis = [];
};

axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // ✅ فقط وقتی واقعاً آفلاینیم (هیچ پاسخ HTTP نداریم) و این روت قابل صف است
    if (
      isNetworkError(error) && // ✅ فقط وقتی هیچ Response نیامده
      isOffline() && // ✅ واقعاً آفلاین
      isOfflineQueueEligible(originalRequest?.url, originalRequest?.method)
    ) {
      notifyQueued(originalRequest);
    }

    // 403 و رفرش توکن
    if (
      error?.response?.status === 403 &&
      originalRequest?.url === `${base_url}${endpoints.getToken}`
    ) {
      store.dispatch(setIsLoggedIn(false));
      window.location.href = pathRoute.loginPagePath;
      return Promise.reject(error);
    } else if (error?.response?.status === 403 && !originalRequest?._retry) {
      if (isRefreshTokenFetching) {
        return new Promise<string>((resolve, reject) => {
          failedApis.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            (originalRequest.headers as any)["Authorization"] =
              "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshTokenFetching = true;

      return new Promise<AxiosResponse>((resolve, reject) => {
        const body = {
          refreshToken: localStorage.getItem(config.userRefreshToken),
        };

        axios
          .post<{ accessToken: string }>(
            `${base_url}${endpoints.getToken}`,
            body
          )
          .then(({ data }) => {
            store.dispatch(setIsLoggedIn(true));
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.accessToken;

            originalRequest.headers = originalRequest.headers || {};
            (originalRequest.headers as any)["Authorization"] =
              "Bearer " + data.accessToken;

            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch((err: AxiosError) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshTokenFetching = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

// ===== Error handling =====
interface ServerError {
  data?: ServerErrorData;
}
interface ServerErrorData {
  data: any;
  message: string;
  messageFa: string;
  messageEn: string;
  error: string;
  statusCode?: number;
}

const handleError = (error?: ServerError): void => {
  if (error?.data?.message === "Unauthorized") return;

  if (error?.data?.messageFa) {
    toast.warning(error.data.messageFa);
    return;
  }
  if (error?.data?.message) {
    toast.warning(error.data.message);
    return;
  }
  if (error?.data?.error) {
    toast.warning(error.data.error);
    return;
  }
};

// ===== API helpers =====
const getFile = async (
  url: string,
  params: Record<string, unknown>,
  zip = false
): Promise<{ isSuccess: boolean; data?: Blob; error?: ServerError }> => {
  let isSuccess = true;
  let data: Blob | undefined;
  let error: ServerError | undefined;
  await axios
    .get(base_url + url, {
      params,
      headers: {
        "Content-Type": zip
          ? "application/x-zip-compressed"
          : "application/json",
        Accept: "application/json",
      },
      responseType: "blob",
    })
    .then((res: AxiosResponse<Blob>) => {
      data = res.data;
    })
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data as ServerError;
      if (!(isOffline() && isOfflineQueueEligible(url, "GET"))) {
        handleError(err?.response?.data as ServerError);
      }
    });

  return { isSuccess, data, error };
};

const getFileCaptcha = async (
  url: string,
  params: Record<string, unknown>
): Promise<{ isSuccess: boolean; data?: ArrayBuffer; error?: ServerError }> => {
  let isSuccess = true;
  let data: ArrayBuffer | undefined;
  let error: ServerError | undefined;
  await axios
    .get(base_url + url, {
      params,
      headers: { Accept: "application/json" },
      responseType: "arraybuffer",
    })
    .then((res: AxiosResponse<ArrayBuffer>) => {
      data = res.data;
    })
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data as ServerError;
      if (!(isOffline() && isOfflineQueueEligible(url, "GET"))) {
        handleError(err?.response?.data as ServerError);
      }
    });

  return { isSuccess, data, error };
};

const get = async (
  url: string,
  params?: Record<string, any>,
  optionalHeaders?: Record<string, string>,
  noError?: boolean
) => {
  let isSuccess = true;
  let data: any;
  let error: any;

  await axios
    .get(base_url + url, {
      params,
      headers: optionalHeaders ? optionalHeaders : { ...defaultHeaders() },
    })
    .then((res) => (data = res.data))
    .catch((err) => {
      isSuccess = false;
      error = err?.response?.data;
      if (!noError) handleError(err?.response);
    });

  return { isSuccess, data, error };
};

const post = async (
  url: string,
  params?: Record<string, any>,
  optionalHeaders?: Record<string, string>,
  noError?: boolean
) => {
  let isSuccess = true;
  let data: any;
  let error: any;
  await axios
    .post(base_url + url, params, {
      headers: optionalHeaders ? optionalHeaders : { ...defaultHeaders() },
    })
    .then((res) => {
      data = res.data;
    })
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data;

      if (!(isOffline() && isOfflineQueueEligible(url, "POST"))) {
        if (!noError) handleError(err?.response as any);
      }
    });

  return { isSuccess, data, error };
};

const put = async (
  url: string,
  params?: Record<string, any>,
  optionalHeaders?: Record<string, string>,
  noError?: boolean
) => {
  let isSuccess = true;
  let data: any;
  let error: any;
  await axios
    .put(base_url + url, params, {
      headers: optionalHeaders ? optionalHeaders : { ...defaultHeaders() },
    })
    .then((res) => (data = res.data))
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data;
      if (!(isOffline() && isOfflineQueueEligible(url, "PUT"))) {
        if (!noError) handleError(err?.response as any);
      }
    });

  return { isSuccess, data, error };
};

const patch = async (
  url: string,
  params?: Record<string, any>,
  optionalHeaders?: Record<string, string>,
  noError?: boolean
) => {
  let isSuccess = true;
  let data: any;
  let error: any;
  await axios
    .patch(base_url + url, params, {
      headers: optionalHeaders ? optionalHeaders : { ...defaultHeaders() },
    })
    .then((res) => (data = res.data))
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data;
      if (!(isOffline() && isOfflineQueueEligible(url, "PATCH"))) {
        if (!noError) handleError(err?.response as any);
      }
    });

  return { isSuccess, data, error };
};

const remove = async (
  url: string,
  params?: Record<string, any>,
  optionalHeaders?: Record<string, string>,
  noError?: boolean
) => {
  let isSuccess = true;
  let data: any;
  let error: any;
  await axios
    .delete(base_url + url, {
      params,
      data: params,
      headers: optionalHeaders ? optionalHeaders : { ...defaultHeaders() },
    })
    .then((res) => (data = res.data))
    .catch((err: AxiosError) => {
      isSuccess = false;
      error = err?.response?.data;
      if (!(isOffline() && isOfflineQueueEligible(url, "DELETE"))) {
        if (!noError) handleError(err?.response as any);
      }
    });

  return { isSuccess, data, error };
};

const apiServices = { get, post, put, patch, remove, getFile, getFileCaptcha };
export default apiServices;
