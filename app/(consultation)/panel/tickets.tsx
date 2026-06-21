import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { TicketItem } from '@/consultation/components/TicketItem';
import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '@/consultation/api/client';
import endpoints from '@/consultation/api/endpoints';
import { useGetConsultationProfile } from '@/consultation/api/useConsultationAuth';
import { router } from 'expo-router';
import { MotiView } from 'moti';

const fetchTickets = async (isCitizen: boolean) => {
  const url = isCitizen ? endpoints.getUserCalls : endpoints.getProviderTickets;
  const res = await consultationApi.get(url, { params: { limit: 20, skip: 0 } });
  return res.data?.data || [];
};

export default function ConsultationTicketsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: profile } = useGetConsultationProfile();

  const isCitizen = profile?.activeRole === 'Citizen' || !profile?.activeRole;

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['consultationTickets', isCitizen],
    queryFn: () => fetchTickets(isCitizen),
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlashList
          data={tickets}
          // @ts-ignore - TS types for FlashList are missing these in this environment
          estimatedItemSize={100}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
          renderItem={({ item, index }: any) => (
            <TicketItem
              id={item._id || item.id}
              title={item.title || item.user?.firstName + ' ' + item.user?.lastName || 'تیکت مشاوره'}
              status={item.status || 'Open'}
              date={new Date(item.createdAt || Date.now()).toLocaleDateString('fa-IR')}
              index={index}
              onPress={(id) => {
                router.push(`/(consultation)/chat/${id}`);
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
