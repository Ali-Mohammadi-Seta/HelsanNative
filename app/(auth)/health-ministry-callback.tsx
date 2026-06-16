import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import {
  applyAuthResponse,
  getSsoRedirectUrl,
  submitHealthMinistryCode,
} from '@/lib/auth/sso';
import type { AppDispatch } from '@/redux/store';

export default function HealthMinistryCallback() {
  const params = useLocalSearchParams<{ code?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleCallback = async () => {
      if (!params.code) {
        Toast.show({
          type: 'error',
          text1: 'Authorization code missing',
        });
        router.replace('/(tabs)/home');
        return;
      }

      try {
        const data = await submitHealthMinistryCode(params.code);
        await applyAuthResponse(data, dispatch);

        Toast.show({
          type: 'success',
          text1: (data as any)?.messageFa || 'Success',
        });

        const redirectUrl = getSsoRedirectUrl(data);
        if (redirectUrl) {
          router.replace({ pathname: '/doctors-consultation', params: { url: redirectUrl } });
          return;
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.response?.data?.messageFa || 'Error',
        });
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
