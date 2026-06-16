import { BackHeader, Button } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HealthMonitoringScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const title = t('healthMonitoring', {
    defaultValue: direction.isRTL ? 'پایش سازمانی' : 'Health monitoring',
  });
  const serviceTitle = t('sepehrHealthMonitoring', {
    defaultValue: direction.isRTL ? 'پایش سپهر' : 'Sepehr monitoring',
  });
  const description = direction.isRTL
    ? 'ورود به سامانه پایش سپهر برای مشاهده و پیگیری خدمات پایش سلامت سازمانی.'
    : 'Open Sepehr monitoring to view and follow organizational health monitoring services.';

  return (
    <View className="flex-1">
      <BackHeader title={title} />
      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl overflow-hidden" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="h-32 bg-amber-100 items-center justify-center">
            <Image source={require('@/assets/images/volunteeringCampaign.gif')} className="w-28 h-28" resizeMode="contain" />
          </View>
          <View className="p-5">
            <View className="items-center mb-4" style={direction.row}>
              <View className="w-14 h-14 rounded-2xl items-center justify-center bg-amber-400/20">
                <Ionicons name="pulse-outline" size={30} color="#f59e0b" />
              </View>
              <View className="flex-1 mx-3" style={direction.startItems}>
                <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 18, ...direction.text }}>
                  {serviceTitle}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 22, marginTop: 4, ...direction.text }}>
                  {description}
                </Text>
              </View>
            </View>
            <Button
              type="primary"
              fullWidth
              icon={<Ionicons name="open-outline" size={18} color="#ffffff" />}
              onPress={() => Linking.openURL('https://payesh.inhso.ir/')}
            >
              {t('goToPage', { defaultValue: direction.isRTL ? 'رفتن به سایت' : 'Go to site' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
