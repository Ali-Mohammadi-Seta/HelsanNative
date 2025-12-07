// app/healthcare-companies.tsx
import { BackHeader } from '@/components';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Real healthcare companies from React app
const healthcareCompanies = [
  {
    id: '1',
    nameKey: 'healthcareCompaniesName.sepehrSalamat',
    defaultName: 'سپهر سلامت',
    link: 'https://sso.inhso.ir/oidc/auth?client_id=client_1753181661291_29ef29cc769b9290&redirect_uri=https://inhs.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir',
    icon: 'pulse',
    color: '#22c55e',
  },
  {
    id: '2',
    nameKey: 'healthcareCompaniesName.madario',
    defaultName: 'مداریو',
    link: 'https://web.medario.ir/user/login',
    icon: 'heart',
    color: '#ef4444',
  },
  {
    id: '3',
    nameKey: 'healthcareCompaniesName.hal',
    defaultName: 'حال',
    link: 'https://haal.ir/',
    icon: 'happy',
    color: '#8b5cf6',
  },
  {
    id: '4',
    nameKey: 'healthcareCompaniesName.pezeshket',
    defaultName: 'پزشکت',
    link: 'https://pezeshket.com/',
    icon: 'person',
    color: '#3b82f6',
  },
];

export default function HealthcareCompaniesScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="flex-1">
      <BackHeader title={t('healthcareCompaniesList') || 'سلامت یارها'} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Info Card */}
        <View className={`flex-row items-center p-4 rounded-2xl mb-5 gap-3 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text
            className={`flex-1 text-sm leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ fontFamily: 'IRANSans' }}
          >
            {t('selectHealthcareService') || 'یکی از سلامت‌یارها را برای دریافت خدمات انتخاب کنید'}
          </Text>
        </View>

        {/* Company Cards - 2x2 Grid */}
        <View className="flex-row flex-wrap justify-between">
          {healthcareCompanies.map((company) => (
            <TouchableOpacity
              key={company.id}
              className={`w-[48%] items-center p-5 rounded-2xl mb-4 shadow-md ${isDark ? 'bg-card' : 'bg-white'}`}
              onPress={() => handleOpenLink(company.link)}
              activeOpacity={0.7}
            >
              <View
                className="w-[72px] h-[72px] rounded-2xl justify-center items-center mb-3"
                style={{ backgroundColor: company.color + '15' }}
              >
                <Ionicons name={company.icon as any} size={36} color={company.color} />
              </View>

              <Text
                className={`text-base text-center mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}
                style={{ fontFamily: 'IRANSans-Bold' }}
                numberOfLines={2}
              >
                {t(company.nameKey) || company.defaultName}
              </Text>

              <View className="flex-row items-center px-3 py-1.5 rounded-lg gap-1 bg-primary/15">
                <Ionicons name="open-outline" size={14} color={colors.primary} />
                <Text className="text-xs text-primary" style={{ fontFamily: 'IRANSans' }}>
                  {t('goToPage') || 'رفتن به سایت'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}