import { Header } from '@/components';
import LeafletMap from '@/components/Map/LeafletMap';
import { apiService } from '@/lib/api/apiService';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock data for nearby medical places (fallback)
const mockPlaces = [
  { _id: '1', name: 'بیمارستان ایرانمهر', category: 'hospital', address: 'خیابان شریعتی', location: { lat: 35.7592, lon: 51.489 } },
  { _id: '2', name: 'داروخانه دکتر محمدی', category: 'pharmacy', address: 'خیابان ولیعصر', location: { lat: 35.6992, lon: 51.399 } },
  { _id: '3', name: 'کلینیک سلامت', category: 'clinic', address: 'میدان ونک', location: { lat: 35.7892, lon: 51.379 } },
];

type PlaceType = 'all' | 'hospital' | 'pharmacy' | 'clinic';

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';
  const [selectedFilter, setSelectedFilter] = useState<PlaceType>('all');
  const [places, setPlaces] = useState<any[]>(mockPlaces);

  const filteredPlaces = places.filter(
    (place) => selectedFilter === 'all' || place.category === selectedFilter || place.type === selectedFilter
  );

  const filters: { key: PlaceType; label: string; icon: string }[] = [
    { key: 'all', label: t('all') || 'همه', icon: 'apps-outline' },
    { key: 'hospital', label: t('hospitals') || 'بیمارستان', icon: 'medical-outline' },
    { key: 'pharmacy', label: t('drugstore') || 'داروخانه', icon: 'medkit-outline' },
    { key: 'clinic', label: t('clinics') || 'کلینیک', icon: 'fitness-outline' },
  ];

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'hospital': case 'بیمارستان': return 'medical';
      case 'pharmacy': case 'داروخانه': return 'medkit';
      case 'clinic': case 'کلینیک': return 'fitness';
      default: return 'location';
    }
  };

  const getPlaceColor = (type: string) => {
    switch (type) {
      case 'hospital': case 'بیمارستان': return '#ef4444';
      case 'pharmacy': case 'داروخانه': return '#22c55e';
      case 'clinic': case 'کلینیک': return '#3b82f6';
      default: return colors.primary;
    }
  };

  const handleRegionChange = async (topLeft: any, bottomRight: any) => {
    try {
      const payload = {
        topLeftLat: topLeft.lat,
        topLeftLng: topLeft.lng,
        bottomRightLat: bottomRight.lat,
        bottomRightLng: bottomRight.lng,
      };
      const response: any = await apiService.getNearbyPlaces(payload);
      if (response?.data) {
        setPlaces(response.data);
      }
    } catch (error) {
      console.log('Error fetching places:', error);
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
            contentContainerStyle={{ gap: 8, flexDirection: isRTL ? 'row' : 'row-reverse' }}
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

        {/* Map View */}
        <View className="h-64 mx-3 rounded-2xl overflow-hidden shadow-sm">
          <LeafletMap
            places={filteredPlaces}
            onRegionChange={handleRegionChange}
          />
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
            className='flex flex-row flex-row-reverse'
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
                <View className={`flex-1 mx-3 flex flex-row justify-between ${isRTL ? 'items-end' : 'items-start'}`}>
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