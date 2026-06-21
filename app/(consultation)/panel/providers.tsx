import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { ProviderCard } from '@/consultation/components/ProviderCard';
import { consultationApi } from '@/consultation/api/client';
import endpoints from '@/consultation/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useDirection } from '@/lib/hooks/useDirection';
import { router } from 'expo-router';
import { MotiView } from 'moti';

const fetchProviders = async (type: 'doctor' | 'psychologist') => {
  const url = type === 'doctor' ? endpoints.getDoctorsList : endpoints.getPsychologistsList;
  const res = await consultationApi.get(url, { params: { limit: 20, skip: 0 } });
  return res.data?.data || [];
};

export default function ConsultationProvidersScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const direction = useDirection();
  const [activeTab, setActiveTab] = useState<'doctor' | 'psychologist'>('doctor');

  const { data: providers, isLoading } = useQuery({
    queryKey: ['consultationProviders', activeTab],
    queryFn: () => fetchProviders(activeTab),
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', padding: 16, gap: 12 }}>
        {(['doctor', 'psychologist'] as const).map((type) => (
          <View
            key={type}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 16,
              alignItems: 'center',
              backgroundColor: activeTab === type ? colors.primary : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }}
            onTouchEnd={() => setActiveTab(type)}
          >
            <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 14, color: activeTab === type ? '#fff' : colors.textSecondary }}>
              {t(`roles.${type}`, { defaultValue: type === 'doctor' ? 'پزشکان' : 'روانشناسان' })}
            </Text>
          </View>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlashList
          data={providers}
          // @ts-ignore - TS types for FlashList are missing these in this environment
          estimatedItemSize={100}
          keyExtractor={(item: any) => item._id || item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
          renderItem={({ item, index }: any) => (
            <ProviderCard
              id={item._id || item.id}
              firstName={item.firstName || ''}
              lastName={item.lastName || ''}
              expertise={item.expertise || 'متخصص'}
              avatarUrl={item.avatarUrl || item.avatar}
              rating={item.rating || 5.0}
              index={index}
              onPress={(id) => {
                // Future single provider page
                // router.push(`/(consultation)/provider/${id}`)
              }}
            />
          )}
          ListEmptyComponent={
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'IRANSans-Medium', color: colors.textSecondary }}>
                {t('generalMessages.noData', { defaultValue: 'موردی یافت نشد.' })}
              </Text>
            </MotiView>
          }
        />
      )}
    </View>
  );
}
