import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLinking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import config from '@/config';
import endpoints from '@/config/endpoints';
import apiClient from '@/lib/api/apiClient';
import { checkAuthorizeApi } from '@/lib/api/apiService';
import { saveTokens } from '@/lib/auth/tokenStorage';
import { loginSuccess, setIsLoggedIn, setUserRole } from '@/redux/slices/authSlice';
import type { AppDispatch } from '@/redux/store';
import type { UserRole } from '@/types/auth.types';

WebBrowser.maybeCompleteAuthSession();

const pendingSsoRedirectStorageKey = 'pendingSsoRedirectUrl';
export const currentRoleStorageKey = 'currentRole';

type UnknownRecord = Record<string, unknown>;
type AuthStatus = {
  isLogin?: boolean;
  roles?: {
    ourRoles?: UserRole[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const stringFrom = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const bearerTokenFrom = (value: unknown): string | null => {
  const token = stringFrom(value);
  if (!token) return null;
  const match = token.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || token;
};

const responseCandidates = (responseBody: unknown): UnknownRecord[] => {
  const candidates: UnknownRecord[] = [];

  if (isRecord(responseBody)) {
    candidates.push(responseBody);

    if (isRecord(responseBody.data)) {
      candidates.push(responseBody.data);

      if (isRecord(responseBody.data.data)) {
        candidates.push(responseBody.data.data);
      }
    }

    if (isRecord(responseBody.headers)) {
      candidates.push(responseBody.headers);
    }
  }

  return candidates;
};

export const getSsoRedirectUrl = (responseBody: unknown): string | null => {
  for (const candidate of responseCandidates(responseBody)) {
    const redirectUrl = stringFrom(candidate.ssoRedirectUrl);
    if (redirectUrl) return redirectUrl;
  }

  return null;
};

export const getAuthTokens = (
  responseBody: unknown
): { accessToken: string | null; refreshToken: string | null } => {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  for (const candidate of responseCandidates(responseBody)) {
    accessToken =
      accessToken ||
      stringFrom(candidate.accessToken) ||
      stringFrom(candidate.access_token) ||
      bearerTokenFrom(candidate.authorization) ||
      bearerTokenFrom(candidate.Authorization);
    refreshToken =
      refreshToken ||
      stringFrom(candidate.refreshToken) ||
      stringFrom(candidate.refresh_token);
  }

  return { accessToken, refreshToken };
};

export const setPendingSsoRedirectUrl = async (redirectUrl: string): Promise<void> => {
  await AsyncStorage.setItem(pendingSsoRedirectStorageKey, redirectUrl);
};

export const clearPendingSsoRedirectUrl = async (): Promise<void> => {
  await AsyncStorage.removeItem(pendingSsoRedirectStorageKey);
};

export const consumePendingSsoRedirectUrl = async (): Promise<string | null> => {
  const redirectUrl = await AsyncStorage.getItem(pendingSsoRedirectStorageKey);
  if (!redirectUrl) return null;

  await AsyncStorage.removeItem(pendingSsoRedirectStorageKey);
  return stringFrom(redirectUrl);
};

export const getStoredCurrentRole = async (): Promise<string | null> =>
  stringFrom(await AsyncStorage.getItem(currentRoleStorageKey));

export const setStoredCurrentRole = async (role: string): Promise<void> => {
  await AsyncStorage.setItem(currentRoleStorageKey, role);
};

export const normalizeRoles = (roles: unknown): UserRole[] => {
  if (Array.isArray(roles)) return roles.filter(Boolean) as UserRole[];
  return roles ? ([roles] as UserRole[]) : [];
};

export const applyAuthResponse = async (
  responseBody: unknown,
  dispatch: AppDispatch
): Promise<AuthStatus | null> => {
  const { accessToken, refreshToken } = getAuthTokens(responseBody);

  if (accessToken && refreshToken) {
    await saveTokens(accessToken, refreshToken);
    dispatch(loginSuccess({ accessToken, refreshToken }));
  }

  try {
    const auth = (await checkAuthorizeApi()) as AuthStatus;
    const roles = normalizeRoles(auth?.roles?.ourRoles);
    dispatch(setIsLoggedIn(Boolean(auth?.isLogin ?? accessToken)));
    dispatch(setUserRole(roles));
    return { ...auth, roles: { ...auth?.roles, ourRoles: roles } };
  } catch {
    if (accessToken) dispatch(setIsLoggedIn(true));
    return null;
  }
};

export const getSsoRedirectUri = (): string =>
  config.behdashtCallbackUrl || ExpoLinking.createURL('/health-ministry-callback');

export const buildSsoStartUrl = (redirectUri = getSsoRedirectUri()): string => {
  const apiBaseUrl = String(config.apiUrl || '').replace(/\/+$/, '');
  
  // Note: Since React Native doesn't have full URL support for relative paths without origin,
  // we manually construct it if necessary, or just use string concatenation.
  return `${apiBaseUrl}${endpoints.ssoStart}?returnTo=${encodeURIComponent(redirectUri)}`;
};

export const startSsoAuth = async (): Promise<{ code?: string; error?: string; state?: string } | null> => {
  const redirectUri = getSsoRedirectUri();
  const result = await WebBrowser.openAuthSessionAsync(
    buildSsoStartUrl(redirectUri),
    redirectUri
  );

  if (result.type !== 'success' || !result.url) return null;

  const parsed = ExpoLinking.parse(result.url);
  const code = Array.isArray(parsed.queryParams?.code) ? stringFrom(parsed.queryParams.code[0]) : stringFrom(parsed.queryParams?.code);
  const error = Array.isArray(parsed.queryParams?.error) ? stringFrom(parsed.queryParams.error[0]) : stringFrom(parsed.queryParams?.error);
  const state = Array.isArray(parsed.queryParams?.state) ? stringFrom(parsed.queryParams.state[0]) : stringFrom(parsed.queryParams?.state);
  
  return { 
    code: code || undefined, 
    error: error || undefined, 
    state: state || undefined 
  };
};

export const submitSsoCode = async (code: string, state?: string, error?: string): Promise<unknown> => {
  const response = await apiClient.post(endpoints.ssoCallback, { code, state, error });
  return response.data;
};
