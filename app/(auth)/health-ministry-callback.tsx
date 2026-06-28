import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import {
  applyAuthResponse,
  getSsoRedirectUrl,
  submitSsoCode,
} from '@/lib/auth/sso';
import type { AppDispatch } from '@/redux/store';
import { showToast } from '@/lib/toast/showToast';

export default function HealthMinistryCallback() {
  const params = useLocalSearchParams<{ code?: string, state?: string, error?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleCallback = async () => {
      if (!params.code && !params.error) {
        showToast({ type: 'error', message: 'Authorization code missing', fallback: 'Error', language: 'en' });
        router.replace('/(tabs)/home');
        return;
      }

      try {
        const data = await submitSsoCode(params.code || '', params.state, params.error);
        await applyAuthResponse(data, dispatch);

        showToast({ type: 'success', message: data, fallback: 'Success', language: 'fa' });

        const redirectUrl = getSsoRedirectUrl(data);
        if (redirectUrl) {
          router.replace({ pathname: '/doctors-consultation', params: { url: redirectUrl } });
          return;
        }
      } catch (error: any) {
        showToast({ type: 'error', message: error, fallback: 'Error', language: 'fa' });
      }

      router.replace('/(tabs)/home');
    };

    handleCallback();
  }, [dispatch, params.code]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#16a34a" />
    </View>
  );
}
