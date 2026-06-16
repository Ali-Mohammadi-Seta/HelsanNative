import { BackHeader } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const healthcareCompanies = [
  {
    id: '1',
    nameKey: 'healthcareCompaniesName.sepehrSalamat',
    defaultNameEn: 'Sepehr Salamat',
    defaultNameFa: 'سپهر سلامت',
    link: 'https://sso.inhso.ir/oidc/auth?client_id=client_1753181661291_29ef29cc769b9290&redirect_uri=https://inhs.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir',
    image: require('@/assets/images/sepehrsalamat.png'),
    color: '#22c55e',
  },
  {
    id: '2',
    nameKey: 'healthcareCompaniesName.madario',
    defaultNameEn: 'Medario',
    defaultNameFa: 'مداریو',
    link: 'https://web.medario.ir/user/login',
    image: require('@/assets/images/medarioImg.png'),
    color: '#ef4444',
  },
  {
    id: '3',
    nameKey: 'healthcareCompaniesName.hal',
    defaultNameEn: 'Haal',
    defaultNameFa: 'حال',
    link: 'https://haal.ir/',
    image: require('@/assets/images/haal.png'),
    color: '#8b5cf6',
  },
  {
    id: '4',
    nameKey: 'healthcareCompaniesName.pezeshket',
    defaultNameEn: 'Pezeshket',
    defaultNameFa: 'پزشکت',
    link: 'https://pezeshket.com/',
    image: require('@/assets/images/doctor.png'),
    color: '#3b82f6',
  },
];

export default function HealthcareCompaniesScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  return (
    <View className="flex-1">
      <BackHeader title={t('healthcareCompaniesList', { defaultValue: direction.isRTL ? 'سلامت‌یارها' : 'Health assistants' })} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl p-4 mb-5" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-center gap-3" style={direction.row}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 23, flex: 1, ...direction.text }}>
              {t('selectHealthcareService', {
                defaultValue: direction.isRTL
                  ? 'یکی از سلامت‌یارها را برای دریافت خدمات انتخاب کنید.'
                  : 'Select a health assistant to access services.',
              })}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {healthcareCompanies.map((company) => (
            <TouchableOpacity
              key={company.id}
              className="w-[48%] items-center p-4 rounded-3xl mb-4"
              style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
              onPress={() => Linking.openURL(company.link)}
              activeOpacity={0.76}
            >
              <View
                className="w-[76px] h-[76px] rounded-3xl justify-center items-center mb-3"
                style={{ backgroundColor: `${company.color}17` }}
              >
                <Image source={company.image} className="w-14 h-14" resizeMode="contain" />
              </View>

              <Text
                style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 14, lineHeight: 20, ...direction.centeredText }}
                numberOfLines={2}
              >
                {t(company.nameKey, { defaultValue: direction.isRTL ? company.defaultNameFa : company.defaultNameEn })}
              </Text>

              <View className="flex-row items-center px-3 py-1.5 rounded-lg gap-1 bg-primary/15 mt-3">
                <Ionicons name="open-outline" size={14} color={colors.primary} />
                <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', fontSize: 11 }}>
                  {t('goToPage', { defaultValue: direction.isRTL ? 'رفتن به سایت' : 'Go to site' })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
