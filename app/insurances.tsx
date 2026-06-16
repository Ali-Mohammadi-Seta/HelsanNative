import { BackHeader, Button } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function InsurancesScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const title = t('SupplementaryInsurance', {
    defaultValue: direction.isRTL ? 'بیمه‌های تکمیلی' : 'Supplementary insurances',
  });
  const serviceTitle = t('SepehrSupplementary', {
    defaultValue: direction.isRTL ? 'بیمه مکمل سپهر' : 'Sepehr supplementary insurance',
  });
  const description = direction.isRTL
    ? 'دسترسی سریع به سامانه بیمه مکمل سپهر برای پیگیری و استفاده از خدمات بیمه‌ای.'
    : 'Quick access to Sepehr supplementary insurance services and follow-up.';

  return (
    <View className="flex-1">
      <BackHeader title={title} />
      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl overflow-hidden" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="h-28 bg-primary/10 items-center justify-center">
            <Image source={require('@/assets/images/insurance.gif')} className="w-24 h-24" resizeMode="contain" />
          </View>
          <View className="p-5">
            <View className="items-center mb-4" style={direction.row}>
              <View className="w-14 h-14 rounded-2xl items-center justify-center bg-white">
                <Image source={require('@/assets/images/favicon.png')} className="w-10 h-10" resizeMode="contain" />
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
              onPress={() => Linking.openURL('https://mokamel.isikato.ir/')}
            >
              {t('goToPage', { defaultValue: direction.isRTL ? 'رفتن به سایت' : 'Go to site' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
