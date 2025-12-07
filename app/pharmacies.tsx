// app/pharmacies.tsx
import { BackHeader } from '@/components';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Real pharmacy links from React app
const pharmacyCompanies = [
  {
    id: '1',
    nameKey: 'healthcareCompaniesName.sepehrSalamat',
    defaultName: 'سپهر سلامت',
    link: 'https://pharmacy.isikato.ir/drgharaee/onlinePharmacy',
    icon: 'medical',
    color: '#22c55e',
  },
  {
    id: '2',
    nameKey: 'healthcareCompaniesName.aggPharma',
    defaultName: 'تجمیع کننده سپهر',
    link: 'https://pharmacy.isikato.ir/',
    icon: 'medkit',
    color: '#3b82f6',
  },
];

export default function PharmaciesScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="flex-1">
      <BackHeader title={t('drugStoreList') || 'لیست داروخانه‌ها'} />

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
            {t('selectPharmacyService') || 'یکی از سرویس‌های زیر را برای مشاهده داروخانه‌ها انتخاب کنید'}
          </Text>
        </View>

        {/* Pharmacy Cards */}
        {pharmacyCompanies.map((company) => (
          <TouchableOpacity
            key={company.id}
            className={`flex-row items-center p-4 rounded-2xl mb-3 shadow-md ${isDark ? 'bg-card' : 'bg-white'}`}
            onPress={() => handleOpenLink(company.link)}
            activeOpacity={0.7}
          >
            <View
              className="w-16 h-16 rounded-2xl justify-center items-center"
              style={{ backgroundColor: company.color + '15' }}
            >
              <Ionicons name={company.icon as any} size={32} color={company.color} />
            </View>

            <View className={`flex-1 mx-4 ${isRTL ? 'items-end' : 'items-start'}`}>
              <Text
                className={`text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'} ${isRTL ? 'text-right' : 'text-left'}`}
                style={{ fontFamily: 'IRANSans-Bold' }}
              >
                {t(company.nameKey) || company.defaultName}
              </Text>
              <Text
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}
                style={{ fontFamily: 'IRANSans' }}
              >
                {t('goToPage') || 'رفتن به سایت'}
              </Text>
            </View>

            <View className="w-10 h-10 rounded-full justify-center items-center bg-primary">
              <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}