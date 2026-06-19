import { BackHeader, SkeletonCard, SkeletonList } from '@/components';
import LeafletMap from '@/components/Map/LeafletMap';
import { apiService } from '@/lib/api/apiService';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const mockPlaces = [
  {
    _id: '1',
    nameFa: 'بیمارستان ایرانمهر',
    nameEn: 'Iranmehr Hospital',
    name: 'Iranmehr Hospital',
    category: 'hospital',
    addressFa: 'خیابان شریعتی',
    addressEn: 'Shariati St',
    address: 'Shariati St',
    location: { lat: 35.7592, lon: 51.489 },
  },
  {
    _id: '2',
    nameFa: 'داروخانه دکتر محمدی',
    nameEn: 'Dr Mohammadi Pharmacy',
    name: 'Dr Mohammadi Pharmacy',
    category: 'pharmacy',
    addressFa: 'خیابان ولیعصر',
    addressEn: 'Valiasr St',
    address: 'Valiasr St',
    location: { lat: 35.6992, lon: 51.399 },
  },
  {
    _id: '3',
    nameFa: 'کلینیک سلامت',
    nameEn: 'Salamat Clinic',
    name: 'Salamat Clinic',
    category: 'clinic',
    addressFa: 'میدان ونک',
    addressEn: 'Vanak Sq',
    address: 'Vanak Sq',
    location: { lat: 35.7892, lon: 51.379 },
  },
];

type PlaceType = 'all' | 'hospital' | 'pharmacy' | 'clinic';

export default function MapScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [selectedFilter, setSelectedFilter] = useState<PlaceType>('all');
  const [places, setPlaces] = useState<any[]>(mockPlaces);
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
  const requestIdRef = useRef(0);
  const filtersRef = useRef<ScrollView>(null);

  const filters: { key: PlaceType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', label: t('all'), icon: 'apps-outline' },
    { key: 'hospital', label: t('hospitals'), icon: 'medical-outline' },
    { key: 'pharmacy', label: t('drugstore'), icon: 'medkit-outline' },
    { key: 'clinic', label: t('clinics'), icon: 'fitness-outline' },
  ];

  const filteredPlaces = places.filter((place) => {
    const category = place.category || place.type;
    return selectedFilter === 'all' || category === selectedFilter;
  });

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
      case 'pharmacy': return colors.primary;
      case 'clinic': return colors.secondary;
      default: return colors.primary;
    }
  };

  const handleRegionChange = async (topLeft: any, bottomRight: any) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsFetchingPlaces(true);

    try {
      const response: any = await apiService.getNearbyPlaces({
        topLeftLat: topLeft.lat,
        topLeftLng: topLeft.lng,
        bottomRightLat: bottomRight.lat,
        bottomRightLng: bottomRight.lng,
      });
      const nextPlaces = response?.data ?? response;
      if (requestId === requestIdRef.current && Array.isArray(nextPlaces)) setPlaces(nextPlaces);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        showToast({
          type: 'error',
          message: error,
          fallback: direction.isRTL ? 'دریافت مکان‌های اطراف انجام نشد.' : 'Could not load nearby places.',
          language: direction.isRTL ? 'fa' : 'en',
        });
      }
    } finally {
      if (requestId === requestIdRef.current) setIsFetchingPlaces(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackHeader title={t('locator')} showBackButton={false} />

      <View className="flex-1" style={{ backgroundColor: isDark ? colors.background : colors.surface }}>
        <View className="px-4 pt-4 pb-3">
          <ScrollView
            ref={filtersRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, flexDirection: direction.isRTL ? 'row-reverse' : 'row' }}
            onContentSizeChange={() => {
              if (direction.isRTL) filtersRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {filters.map((filter) => {
              const active = selectedFilter === filter.key;
              return (
                <TouchableOpacity
                  key={filter.key}
                  className="items-center px-4 py-2.5 rounded-full border"
                  style={{
                    flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                    gap: 7,
                    backgroundColor: active ? colors.primary : isDark ? colors.card : '#ffffff',
                    borderColor: active ? colors.primary : colors.border,
                  }}
                  onPress={() => setSelectedFilter(filter.key)}
                  activeOpacity={0.75}
                >
                  <Ionicons name={filter.icon} size={16} color={active ? '#ffffff' : colors.primary} />
                  <Text
                    style={{
                      color: active ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans-Bold',
                      fontSize: 12,
                      writingDirection: direction.dir,
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="h-72 mx-4 rounded-3xl overflow-hidden">
          <LeafletMap places={filteredPlaces} onRegionChange={handleRegionChange} />
        </View>

        <View className="flex-1 px-4 pt-4">
          <View className="items-center justify-between mb-3" style={direction.row}>
            <Text
              style={{
                color: colors.text,
                fontFamily: 'IRANSans-Bold',
                fontSize: 16,
                ...direction.text,
              }}
            >
              {t('nearbyPlaces')}
            </Text>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}1f` }}>
              <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', fontSize: 12 }}>
                {filteredPlaces.length} {t('results')}
              </Text>
            </View>
          </View>

          <FlashList
            data={filteredPlaces}
            keyExtractor={(item, index) => item._id || item.id || String(index)}
            ListHeaderComponent={isFetchingPlaces && filteredPlaces.length > 0 ? <SkeletonCard rows={2} avatar /> : null}
            ListEmptyComponent={isFetchingPlaces ? <SkeletonList count={3} rows={2} avatar /> : null}
            renderItem={({ item, index }) => {
              const type = item.category || item.type || 'location';
              const color = getPlaceColor(type);
              const name = direction.isRTL ? item.nameFa || item.name : item.nameEn || item.name;
              const address = direction.isRTL ? item.addressFa || item.address : item.addressEn || item.address;
              return (
                <MotiView
                  from={{ opacity: 0, translateY: 15 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 250, delay: index * 30 }}
                >
                  <TouchableOpacity
                    className="rounded-2xl p-3 mb-3 border"
                    style={{ backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border }}
                    activeOpacity={0.75}
                  >
                    <View className="items-center" style={direction.row}>
                      <View
                        className="w-12 h-12 rounded-2xl justify-center items-center"
                        style={{ backgroundColor: `${color}1f` }}
                      >
                        <Ionicons name={getPlaceIcon(type) as any} size={24} color={color} />
                      </View>
                      <View className="flex-1 mx-3" style={direction.startItems}>
                        <Text
                          style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 14, ...direction.text }}
                          numberOfLines={1}
                        >
                          {name}
                        </Text>
                        <Text
                          style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginTop: 3, ...direction.text }}
                          numberOfLines={1}
                        >
                          {address}
                        </Text>
                      </View>
                      <View className="w-9 h-9 rounded-full justify-center items-center" style={{ backgroundColor: `${colors.primary}1f` }}>
                        <Ionicons name="navigate" size={16} color={colors.primary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </MotiView>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
