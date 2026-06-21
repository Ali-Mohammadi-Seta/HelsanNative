import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Stack, router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useGetConsultationProfile } from '@/consultation/api/useConsultationAuth';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultationLayout() {
  const { colors } = useTheme();
  const direction = useDirection();
  const segments = useSegments();
  const { data: profile, isLoading, isError, error } = useGetConsultationProfile();

  useEffect(() => {
    if (!isLoading && profile) {
      const inAuthGroup = segments.includes('auth' as never);
      if (profile.roles?.length > 1 && !profile.activeRole && !inAuthGroup) {
        // Force them to role select
        router.replace('/(consultation)/auth/role-select');
      } else if (profile.roles?.length > 1 && inAuthGroup && profile.activeRole) {
        // Already active, pushing to home
      }
    }
  }, [profile, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ fontFamily: 'IRANSans-Medium', color: colors.textSecondary, marginTop: 16 }}>در حال اتصال به سرور مشاوره...</Text>
      </View>
    );
  }

  if (isError || (!isLoading && !profile)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(239, 68, 68, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Ionicons name="warning" size={40} color="#ef4444" />
        </View>
        <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 18, color: colors.text, marginBottom: 8, textAlign: 'center' }}>
          خطا در برقراری ارتباط
        </Text>
        <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
          {error?.message || 'لطفاً اینترنت خود را بررسی کنید یا مجدداً وارد شوید.'}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 12 }}
        >
          <Text style={{ fontFamily: 'IRANSans-Bold', color: '#fff', fontSize: 14 }}>بازگشت به صفحه اصلی</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: direction.isRTL ? 'slide_from_left' : 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
