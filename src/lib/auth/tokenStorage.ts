// src/lib/auth/tokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '@/config';

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [config.userAccessToken, accessToken],
      [config.userRefreshToken, refreshToken],
    ]);
    console.log('✅ [TOKEN] Tokens saved');
  } catch (error) {
    console.error('❌ [TOKEN] Save failed:', error);
    throw error;
  }
};

export const saveAccessToken = async (accessToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(config.userAccessToken, accessToken);
    console.log('✅ [TOKEN] Access token updated');
  } catch (error) {
    console.error('❌ [TOKEN] Save access token failed:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(config.userAccessToken);
  } catch (error) {
    console.error('❌ [TOKEN] Get access token failed:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(config.userRefreshToken);
  } catch (error) {
    console.error('❌ [TOKEN] Get refresh token failed:', error);
    return null;
  }
};

export const removeTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      config.userAccessToken,
      config.userRefreshToken,
    ]);
    console.log('✅ [TOKEN] Tokens removed');
  } catch (error) {
    console.error('❌ [TOKEN] Remove failed:', error);
    throw error;
  }
};