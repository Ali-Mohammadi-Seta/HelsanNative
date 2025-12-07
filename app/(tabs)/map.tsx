// app/(tabs)/map.tsx
import { Header } from '@/components';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock data for nearby medical places
const mockPlaces = [
  { id: '1', name: 'بیمارستان ایرانمهر', type: 'hospital', address: 'خیابان شریعتی' },
  { id: '2', name: 'داروخانه دکتر محمدی', type: 'pharmacy', address: 'خیابان ولیعصر' },
  { id: '3', name: 'کلینیک سلامت', type: 'clinic', address: 'میدان ونک' },
  { id: '4', name: 'داروخانه شبانه‌روزی', type: 'pharmacy', address: 'تجریش' },
  { id: '5', name: 'بیمارستان پارسیان', type: 'hospital', address: 'سعادت آباد' },
  { id: '6', name: 'کلینیک قلب', type: 'clinic', address: 'جردن' },
];

type PlaceType = 'all' | 'hospital' | 'pharmacy' | 'clinic';

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';
  const [selectedFilter, setSelectedFilter] = useState<PlaceType>('all');

  const filteredPlaces = mockPlaces.filter(
    (place) => selectedFilter === 'all' || place.type === selectedFilter
  );

  const filters: { key: PlaceType; label: string; icon: string }[] = [
    { key: 'all', label: t('all') || 'همه', icon: 'apps-outline' },
    { key: 'hospital', label: t('hospitals') || 'بیمارستان', icon: 'medical-outline' },
    { key: 'pharmacy', label: t('drugstore') || 'داروخانه', icon: 'medkit-outline' },
    { key: 'clinic', label: t('clinics') || 'کلینیک', icon: 'fitness-outline' },
  ];

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'hospital': return 'medical';
      case 'pharmacy': return 'medkit';
      case 'clinic': return 'fitness';
      default: return 'location';
    }
  };

  const getPlaceColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#ef4444';
      case 'pharmacy': return '#22c55e';
      case 'clinic': return '#3b82f6';
      default: return colors.primary;
    }
  };

  return (
    <View className="flex-1">
      <Header title={t('locator') || 'مکان‌یاب'} />

      <View className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}>
        {/* Filter Chips */}
        <View className="p-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                className={`flex-row items-center px-3 py-2 rounded-full gap-1.5 shadow-sm ${selectedFilter === filter.key ? 'bg-primary' : isDark ? 'bg-card' : 'bg-white'
                  }`}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={selectedFilter === filter.key ? '#ffffff' : colors.primary}
                />
                <Text
                  className={`text-xs ${selectedFilter === filter.key ? 'text-white' : isDark ? 'text-white' : 'text-gray-700'}`}
                  style={{ fontFamily: 'IRANSans' }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map Placeholder */}
        <View className={`h-44 mx-3 rounded-2xl justify-center items-center ${isDark ? 'bg-card' : 'bg-gray-200'}`}>
          <Ionicons name="map" size={64} color={colors.primary} />
          <Text className={`text-sm mt-3 ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'IRANSans' }}>
            {t('mapPlaceholder') || 'نقشه در اینجا نمایش داده می‌شود'}
          </Text>
        </View>

        {/* Nearby Places List */}
        <View className="flex-1 p-3">
          <Text
            className={`text-base mb-3 ${isDark ? 'text-white' : 'text-gray-800'} ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ fontFamily: 'IRANSans-Bold' }}
          >
            {t('nearbyPlaces') || 'مکان‌های نزدیک'} ({filteredPlaces.length})
          </Text>

          <FlatList
            data={filteredPlaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-xl mb-2.5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-xl justify-center items-center"
                  style={{ backgroundColor: getPlaceColor(item.type) + '20' }}
                >
                  <Ionicons name={getPlaceIcon(item.type) as any} size={24} color={getPlaceColor(item.type)} />
                </View>
                <View className={`flex-1 mx-3 ${isRTL ? 'items-end' : 'items-start'}`}>
                  <Text
                    className={`text-sm ${isDark ? 'text-white' : 'text-gray-800'} ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: 'IRANSans-Bold' }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: 'IRANSans' }}
                  >
                    {item.address}
                  </Text>
                </View>
                <TouchableOpacity className="w-9 h-9 rounded-full justify-center items-center bg-primary">
                  <Ionicons name="navigate" size={16} color="#ffffff" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}