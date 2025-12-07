// app/medical-centers.tsx
import { BackHeader } from '@/components';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Category = 'hospitals' | 'clinics' | 'privateClinics';

// Mock data for medical centers
const mockMedicalCenters = {
  hospitals: [
    { id: '1', name: 'بیمارستان ایرانمهر', address: 'خیابان شریعتی - قلهک', phone: '021-88888888', rating: 4.5, reviews: 128 },
    { id: '2', name: 'بیمارستان پارسیان', address: 'خیابان ولیعصر - ونک', phone: '021-77777777', rating: 4.2, reviews: 95 },
    { id: '3', name: 'بیمارستان آتیه', address: 'سعادت آباد - بلوار فرحزادی', phone: '021-66666666', rating: 4.7, reviews: 210 },
    { id: '4', name: 'بیمارستان مهر', address: 'تهران - خیابان شهید بهشتی', phone: '021-55555555', rating: 4.0, reviews: 75 },
  ],
  clinics: [
    { id: '1', name: 'کلینیک تخصصی سلامت', address: 'تهران - میرداماد', phone: '021-44444444', rating: 4.3, reviews: 65 },
    { id: '2', name: 'کلینیک فوق تخصصی قلب', address: 'تهران - جردن', phone: '021-33333333', rating: 4.6, reviews: 112 },
    { id: '3', name: 'کلینیک زنان و زایمان', address: 'تهران - پاسداران', phone: '021-22222222', rating: 4.4, reviews: 88 },
  ],
  privateClinics: [
    { id: '1', name: 'مطب دکتر احمدی', address: 'تهران - ولنجک', phone: '021-11111111', rating: 4.8, reviews: 45 },
    { id: '2', name: 'مطب دکتر محمدی', address: 'تهران - الهیه', phone: '021-99999999', rating: 4.5, reviews: 32 },
  ],
};

interface MedicalCenterCardProps {
  item: { id: string; name: string; address: string; phone: string; rating: number; reviews: number };
  isDark: boolean;
  colors: any;
  isRTL: boolean;
}

const MedicalCenterCard: React.FC<MedicalCenterCardProps> = ({ item, isDark, colors, isRTL }) => (
  <TouchableOpacity
    className={`flex-row rounded-2xl mb-3 overflow-hidden shadow-md ${isDark ? 'bg-card' : 'bg-white'}`}
    activeOpacity={0.7}
  >
    <View className={`w-24 h-28 justify-center items-center ${isDark ? 'bg-surface' : 'bg-gray-100'}`}>
      <Ionicons name="business-outline" size={40} color={colors.primary} />
    </View>

    <View className={`flex-1 p-3 justify-between ${isRTL ? 'items-end' : 'items-start'}`}>
      <Text
        className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`}
        style={{ fontFamily: 'IRANSans-Bold' }}
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <View className={`flex-row items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Ionicons name="location-outline" size={14} color={isDark ? colors.textSecondary : '#6b7280'} />
        <Text className={`text-xs mx-1 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }} numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View className={`flex-row items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Ionicons name="call-outline" size={14} color={isDark ? colors.textSecondary : '#6b7280'} />
        <Text className={`text-xs mx-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
          {item.phone}
        </Text>
      </View>

      <View className={`flex-row items-center mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <View className="flex-row items-center bg-amber-100 px-1.5 py-0.5 rounded-md gap-1">
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text className="text-xs font-bold text-amber-800" style={{ fontFamily: 'IRANSans-Bold' }}>{item.rating}</Text>
        </View>
        <Text className={`text-xs mx-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: 'IRANSans' }}>
          ({item.reviews} {isRTL ? 'نظر' : 'reviews'})
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function MedicalCentersScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';
  const [activeCategory, setActiveCategory] = useState<Category>('hospitals');

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'hospitals', label: t('hospitals') || 'بیمارستان‌ها', icon: 'medical-outline' },
    { key: 'clinics', label: t('clinics') || 'کلینیک‌ها', icon: 'fitness-outline' },
    { key: 'privateClinics', label: t('privateClinics') || 'مطب‌ها', icon: 'person-outline' },
  ];

  const currentData = mockMedicalCenters[activeCategory];

  return (
    <View className="flex-1">
      <BackHeader title={t('header.places') || 'مراکز درمانی'} />

      <View className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}>
        {/* Category Tabs */}
        <View className="py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  className={`flex-row items-center px-4 py-2.5 rounded-xl gap-2 shadow-sm ${isActive ? 'bg-primary' : isDark ? 'bg-card' : 'bg-white'}`}
                  activeOpacity={0.7}
                >
                  <Ionicons name={cat.icon as any} size={20} color={isActive ? '#ffffff' : colors.primary} />
                  <Text
                    className={`text-sm ${isActive ? 'text-white' : isDark ? 'text-white' : 'text-gray-700'}`}
                    style={{ fontFamily: 'IRANSans-Bold' }}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results count */}
        <View className={`px-4 pb-2 ${isRTL ? 'items-end' : 'items-start'}`}>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
            {currentData.length} {t('results') || 'نتیجه'}
          </Text>
        </View>

        {/* List */}
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicalCenterCard item={item} isDark={isDark} colors={colors} isRTL={isRTL} />
          )}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}