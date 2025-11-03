// app/(auth)/health-ministry-callback.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';

export default function HealthMinistryCallback() {
  const params = useLocalSearchParams<{ code?: string }>();

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
        const response = await apiClient.post(endpoints.healthGovRegister, {
          code: params.code,
        });

        if (response?.data) {
          Toast.show({
            type: 'success',
            text1: response.data?.messageFa || 'Success',
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.response?.data?.messageFa || 'Error',
        });
      } finally {
        router.replace('/(tabs)/home');
      }
    };

    handleCallback();
  }, [params.code]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#16a34a" />
    </View>
  );
}