import { BackHeader } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Category = 'hospitals' | 'clinics' | 'privateClinics';

const centerData = {
  hospitals: [
    { id: '1', nameFa: 'بیمارستان ایرانمهر', nameEn: 'Iranmehr Hospital', addressFa: 'خیابان شریعتی، قلهک', addressEn: 'Shariati St, Gholhak', phone: '021-88888888', rating: 4.5, reviews: 128 },
    { id: '2', nameFa: 'بیمارستان پارسیان', nameEn: 'Parsian Hospital', addressFa: 'خیابان ولیعصر، ونک', addressEn: 'Valiasr St, Vanak', phone: '021-77777777', rating: 4.2, reviews: 95 },
    { id: '3', nameFa: 'بیمارستان آتیه', nameEn: 'Atieh Hospital', addressFa: 'سعادت آباد، فرحزادی', addressEn: 'Saadat Abad, Farahzadi', phone: '021-66666666', rating: 4.7, reviews: 210 },
  ],
  clinics: [
    { id: '1', nameFa: 'کلینیک تخصصی سلامت', nameEn: 'Salamat Specialty Clinic', addressFa: 'تهران، میرداماد', addressEn: 'Tehran, Mirdamad', phone: '021-44444444', rating: 4.3, reviews: 65 },
    { id: '2', nameFa: 'کلینیک فوق تخصصی قلب', nameEn: 'Heart Specialty Clinic', addressFa: 'تهران، جردن', addressEn: 'Tehran, Jordan', phone: '021-33333333', rating: 4.6, reviews: 112 },
  ],
  privateClinics: [
    { id: '1', nameFa: 'مطب دکتر احمدی', nameEn: 'Dr Ahmadi Office', addressFa: 'تهران، ولنجک', addressEn: 'Tehran, Velenjak', phone: '021-11111111', rating: 4.8, reviews: 45 },
    { id: '2', nameFa: 'مطب دکتر محمدی', nameEn: 'Dr Mohammadi Office', addressFa: 'تهران، الهیه', addressEn: 'Tehran, Elahieh', phone: '021-99999999', rating: 4.5, reviews: 32 },
  ],
};

export default function MedicalCentersScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [activeCategory, setActiveCategory] = useState<Category>('hospitals');

  const categories: { key: Category; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'hospitals', label: t('hospitals', { defaultValue: direction.isRTL ? 'بیمارستان‌ها' : 'Hospitals' }), icon: 'medical-outline' },
    { key: 'clinics', label: t('clinics', { defaultValue: direction.isRTL ? 'کلینیک‌ها' : 'Clinics' }), icon: 'fitness-outline' },
    { key: 'privateClinics', label: t('privateClinics', { defaultValue: direction.isRTL ? 'مطب‌ها' : 'Private clinics' }), icon: 'person-outline' },
  ];
  const currentData = centerData[activeCategory];

  return (
    <View className="flex-1">
      <BackHeader title={t('header.places', { defaultValue: direction.isRTL ? 'مراکز درمانی' : 'Medical centers' })} />

      <View className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}>
        <View className="py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10, flexDirection: direction.isRTL ? 'row-reverse' : 'row' }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  className="items-center px-4 py-2.5 rounded-full"
                  style={{
                    flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                    gap: 8,
                    backgroundColor: isActive ? colors.primary : isDark ? colors.card : '#ffffff',
                    borderWidth: isActive ? 0 : 1,
                    borderColor: isDark ? colors.border : '#e5e7eb',
                  }}
                  activeOpacity={0.75}
                >
                  <Ionicons name={cat.icon} size={18} color={isActive ? '#ffffff' : colors.primary} />
                  <Text
                    style={{
                      color: isActive ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans-Bold',
                      fontSize: 12,
                      writingDirection: direction.dir,
                    }}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={direction.startItems} className="px-4 pb-2">
          <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, ...direction.text }}>
            {currentData.length} {t('results', { defaultValue: direction.isRTL ? 'نتیجه' : 'results' })}
          </Text>
        </View>

        <FlashList
          data={currentData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 250, delay: index * 40 }}
            >
              <TouchableOpacity
                className="rounded-3xl p-4 mb-3"
                style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
                activeOpacity={0.75}
              >
              <View className="items-start" style={direction.row}>
                <View className="w-20 h-24 rounded-2xl justify-center items-center bg-primary/10">
                  <Ionicons name="business-outline" size={38} color={colors.primary} />
                </View>
                <View className="flex-1 mx-3" style={direction.startItems}>
                  <Text
                    style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 16, ...direction.text }}
                    numberOfLines={1}
                  >
                    {direction.isRTL ? item.nameFa : item.nameEn}
                  </Text>
                  <InfoLine icon="location-outline" text={direction.isRTL ? item.addressFa : item.addressEn} />
                  <InfoLine icon="call-outline" text={item.phone} />
                  <View className="items-center mt-2" style={direction.row}>
                    <View className="flex-row items-center bg-amber-100 px-2 py-1 rounded-full gap-1">
                      <Ionicons name="star" size={12} color="#f59e0b" />
                      <Text style={{ color: '#92400e', fontFamily: 'IRANSans-Bold', fontSize: 11 }}>{item.rating}</Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 11, marginHorizontal: 8 }}>
                      {item.reviews} {direction.isRTL ? 'نظر' : 'reviews'}
                    </Text>
                  </View>
                </View>
              </View>
              </TouchableOpacity>
            </MotiView>
          )}
        />
      </View>
    </View>
  );
}

function InfoLine({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  const direction = useDirection();
  return (
    <View className="items-center mt-2" style={direction.row}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text
        style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginHorizontal: 6, flex: 1, ...direction.text }}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}
