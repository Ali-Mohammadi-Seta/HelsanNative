import { BackHeader, Button } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const pharmacyCompanies = [
  {
    id: '1',
    nameKey: 'healthcareCompaniesName.sepehrSalamat',
    defaultNameEn: 'Sepehr Salamat',
    defaultNameFa: 'سپهر سلامت',
    link: 'https://pharmacy.isikato.ir/drgharaee/onlinePharmacy',
    image: require('@/assets/images/sepherPharma.png'),
    color: '#22c55e',
  },
  {
    id: '2',
    nameKey: 'healthcareCompaniesName.aggPharma',
    defaultNameEn: 'Sepehr Aggregator',
    defaultNameFa: 'تجمیع کننده سپهر',
    link: 'https://pharmacy.isikato.ir/',
    image: require('@/assets/images/aggPharma.png'),
    color: '#3b82f6',
  },
];

export default function PharmaciesScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  return (
    <View className="flex-1">
      <BackHeader title={t('drugStoreList', { defaultValue: direction.isRTL ? 'لیست داروخانه‌ها' : 'Pharmacies' })} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl p-4 mb-5" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-center gap-3" style={direction.row}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 23, flex: 1, ...direction.text }}>
              {t('selectPharmacyService', {
                defaultValue: direction.isRTL
                  ? 'یکی از سرویس‌های زیر را برای مشاهده داروخانه‌ها انتخاب کنید.'
                  : 'Select one of the services below to view pharmacies.',
              })}
            </Text>
          </View>
        </View>

        {pharmacyCompanies.map((company) => (
          <TouchableOpacity
            key={company.id}
            className="rounded-3xl p-4 mb-4"
            style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
            onPress={() => Linking.openURL(company.link)}
            activeOpacity={0.76}
          >
            <View className="items-center" style={direction.row}>
              <View
                className="w-20 h-20 rounded-3xl justify-center items-center"
                style={{ backgroundColor: `${company.color}17` }}
              >
                <Image source={company.image} className="w-14 h-14" resizeMode="contain" />
              </View>

              <View className="flex-1 mx-4" style={direction.startItems}>
                <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 17, ...direction.text }}>
                  {t(company.nameKey, { defaultValue: direction.isRTL ? company.defaultNameFa : company.defaultNameEn })}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, marginTop: 5, ...direction.text }}>
                  {t('goToPage', { defaultValue: direction.isRTL ? 'رفتن به سایت' : 'Go to site' })}
                </Text>
              </View>

              <View className="w-10 h-10 rounded-full justify-center items-center" style={{ backgroundColor: colors.primary }}>
                <Ionicons name={direction.isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#ffffff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Button
          type="secondary"
          variant="outline"
          fullWidth
          icon={<Ionicons name="map-outline" size={18} color={colors.primary} />}
          onPress={() => Linking.openURL('https://pharmacy.isikato.ir/')}
        >
          {direction.isRTL ? 'مشاهده همه خدمات دارویی' : 'View all pharmacy services'}
        </Button>
      </ScrollView>
    </View>
  );
}
