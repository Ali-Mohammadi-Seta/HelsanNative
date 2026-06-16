import { BackHeader, Button, FloatingInput } from '@/components';
import config from '@/config';
import {
  getProvidersListApi,
  type ProviderListFilters,
  type ProviderListItem,
  type ProviderListResponse,
  type ProviderListType,
} from '@/lib/api/apiService';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

type FilterState = {
  name: string;
  medicalId: string;
  medicalCity: string;
  expertise: string;
  licenseNumber: string;
  field: string;
  province: string;
  city: string;
};

type FilterConfig = {
  key: keyof FilterState;
  labelKey: string;
  placeholderKey: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type ProviderCopy = {
  titleKey: string;
  subtitleKey: string;
  resultKey: string;
  emptyKey: string;
  badgeKey: string;
  actionKey: string;
  accent: string;
  soft: string;
  icon: keyof typeof Ionicons.glyphMap;
  filters: FilterConfig[];
};

const PAGE_SIZE = 10;

const initialFilters: FilterState = {
  name: '',
  medicalId: '',
  medicalCity: '',
  expertise: '',
  licenseNumber: '',
  field: '',
  province: '',
  city: '',
};

const providerCopy: Record<ProviderListType, ProviderCopy> = {
  doctor: {
    titleKey: 'doctors',
    subtitleKey: 'providerDirectory.doctorSubtitle',
    resultKey: 'providerDirectory.doctorResult',
    emptyKey: 'providerDirectory.doctorEmpty',
    badgeKey: 'roles.Doctor',
    actionKey: 'providerDirectory.onlineVisit',
    accent: '#10b981',
    soft: '#d1fae5',
    icon: 'heart-outline',
    filters: [
      { key: 'name', labelKey: 'providerDirectory.doctorName', placeholderKey: 'providerDirectory.namePlaceholder', icon: 'person-outline' },
      { key: 'expertise', labelKey: 'providerDirectory.expertise', placeholderKey: 'providerDirectory.expertisePlaceholder', icon: 'ribbon-outline' },
      { key: 'medicalId', labelKey: 'providerDirectory.medicalId', placeholderKey: 'providerDirectory.medicalIdPlaceholder', icon: 'barcode-outline' },
      { key: 'medicalCity', labelKey: 'providerDirectory.medicalCity', placeholderKey: 'providerDirectory.cityPlaceholder', icon: 'location-outline' },
    ],
  },
  psychologist: {
    titleKey: 'psychologists',
    subtitleKey: 'providerDirectory.psychologistSubtitle',
    resultKey: 'providerDirectory.psychologistResult',
    emptyKey: 'providerDirectory.psychologistEmpty',
    badgeKey: 'roles.Psychologist',
    actionKey: 'providerDirectory.onlineConsultation',
    accent: '#8b5cf6',
    soft: '#ede9fe',
    icon: 'sparkles-outline',
    filters: [
      { key: 'name', labelKey: 'providerDirectory.psychologistName', placeholderKey: 'providerDirectory.namePlaceholder', icon: 'person-outline' },
      { key: 'field', labelKey: 'providerDirectory.field', placeholderKey: 'providerDirectory.fieldPlaceholder', icon: 'briefcase-outline' },
      { key: 'licenseNumber', labelKey: 'providerDirectory.licenseNumber', placeholderKey: 'providerDirectory.licensePlaceholder', icon: 'barcode-outline' },
      { key: 'province', labelKey: 'providerDirectory.province', placeholderKey: 'providerDirectory.provincePlaceholder', icon: 'map-outline' },
      { key: 'city', labelKey: 'shahr', placeholderKey: 'providerDirectory.cityPlaceholder', icon: 'location-outline' },
    ],
  },
};

const getProviderId = (provider: ProviderListItem) =>
  provider.id || provider._id || provider.userId || '';

const getFullName = (provider: ProviderListItem, fallback: string) =>
  [provider.firstName, provider.lastName].filter(Boolean).join(' ') || fallback;

const getInitials = (provider: ProviderListItem) => {
  const first = provider.firstName?.trim()?.[0] ?? '';
  const last = provider.lastName?.trim()?.[0] ?? '';
  return first + last || '?';
};

const buildQueryFilters = (
  providerType: ProviderListType,
  filters: FilterState,
  page: number,
): ProviderListFilters => {
  const base: ProviderListFilters = {
    page: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  };
  const withName = filters.name.trim() ? { ...base, name: filters.name.trim() } : base;

  if (providerType === 'doctor') {
    return {
      ...withName,
      ...(filters.expertise.trim() && { LastDegreeField: filters.expertise.trim() }),
      ...(filters.medicalCity.trim() && { MCCity: filters.medicalCity.trim() }),
      ...(filters.medicalId.trim() && { McCode: filters.medicalId.trim() }),
    };
  }

  return {
    ...withName,
    ...(filters.field.trim() && { field: filters.field.trim() }),
    ...(filters.licenseNumber.trim() && { licenseNumber: filters.licenseNumber.trim() }),
    ...(filters.province.trim() && { province: filters.province.trim() }),
    ...(filters.city.trim() && { city: filters.city.trim() }),
  };
};

const hasActiveFilters = (filters: FilterState) =>
  Object.values(filters).some((value) => value.trim().length > 0);

const buildConsultationProviderUrl = (
  providerType: ProviderListType,
  provider: ProviderListItem,
) => {
  const providerId = getProviderId(provider);
  const launchUrl = config.consultationSsoUrl?.trim();
  if (!providerId || !launchUrl) return null;

  const providerPath =
    providerType === 'doctor'
      ? `/doctors/${encodeURIComponent(providerId)}`
      : `/psychologists/${encodeURIComponent(providerId)}`;

  try {
    const url = new URL(launchUrl);
    url.searchParams.set('returnTo', providerPath);
    return url.toString();
  } catch {
    const separator = launchUrl.includes('?') ? '&' : '?';
    return `${launchUrl}${separator}returnTo=${encodeURIComponent(providerPath)}`;
  }
};

export default function ProvidersDirectory({ providerType }: { providerType: ProviderListType }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const copy = providerCopy[providerType];

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const queryFilters = useMemo(() => ({ ...appliedFilters }), [appliedFilters]);
  const active = hasActiveFilters(appliedFilters);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<ProviderListResponse>({
    queryKey: ['providersDirectory', providerType, queryFilters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getProvidersListApi(
        providerType,
        buildQueryFilters(providerType, appliedFilters, Number(pageParam)),
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return loadedItems < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const providers = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const applyFilters = () => {
    setAppliedFilters(filters);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const openConsultation = (provider: ProviderListItem) => {
    const url = buildConsultationProviderUrl(providerType, provider);
    if (url) router.push({ pathname: '/doctors-consultation', params: { url } });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? colors.background : '#f8fafc' }}>
      <BackHeader title={t(copy.titleKey)} />

      <FlatList
        data={providers}
        keyExtractor={(item, index) => `${getProviderId(item) || item.medicalId || item.licenseNumber || 'provider'}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 34 }}
        ListHeaderComponent={
          <View>
            <View
              className="rounded-3xl p-4 mb-4 overflow-hidden"
              style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
            >
              <View className="items-center" style={direction.row}>
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: copy.soft }}
                >
                  <Ionicons name={copy.icon} size={28} color={copy.accent} />
                </View>
                <View className="flex-1 mx-3" style={direction.startItems}>
                  <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 18, ...direction.text }}>
                    {t(copy.titleKey)}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 22, marginTop: 4, ...direction.text }}>
                    {t(copy.subtitleKey)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setFilterOpen((current) => !current)}
              className="rounded-2xl px-4 py-3 mb-3 border"
              style={{
                backgroundColor: isDark ? colors.card : '#ffffff',
                borderColor: isDark ? colors.border : '#e5e7eb',
              }}
            >
              <View className="items-center justify-between" style={direction.row}>
                <View className="items-center gap-2" style={direction.row}>
                  <Ionicons name="options-outline" size={19} color={copy.accent} />
                  <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 13 }}>
                    {t('searchFilter')}
                  </Text>
                </View>
                <Text style={{ color: active ? copy.accent : colors.textSecondary, fontFamily: 'IRANSans-Medium', fontSize: 12 }}>
                  {filterOpen ? t('cancel') : active ? t('providerDirectory.activeFilter') : t('providerDirectory.openFilters')}
                </Text>
              </View>
            </TouchableOpacity>

            {filterOpen && (
              <View className="rounded-3xl p-4 mb-4" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
                {copy.filters.map((filter) => (
                  <FloatingInput
                    key={filter.key}
                    label={t(filter.labelKey)}
                    placeholder={t(filter.placeholderKey)}
                    value={filters[filter.key]}
                    onChangeText={(text) => setFilters((current) => ({ ...current, [filter.key]: text }))}
                    dir={direction.dir}
                  />
                ))}

                <View className="gap-3 mt-1">
                  <Button type="primary" fullWidth onPress={applyFilters}>
                    {t('search')}
                  </Button>
                  {active && (
                    <Button type="secondary" variant="outline" fullWidth onPress={clearFilters}>
                      {t('remove')}
                    </Button>
                  )}
                </View>
              </View>
            )}

            <View className="mb-3" style={direction.startItems}>
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, ...direction.text }}>
                {isLoading ? t('loading') : `${total} ${t(copy.resultKey)}`}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            providerType={providerType}
            copy={copy}
            onConsultation={() => openConsultation(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-3xl border border-dashed p-8 mt-3" style={{ borderColor: colors.border }}>
            {isLoading ? (
              <ActivityIndicator color={copy.accent} />
            ) : (
              <>
                <Ionicons name="search-outline" size={34} color={colors.textTertiary} />
                <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, marginTop: 12, ...direction.centeredText }}>
                  {t(copy.emptyKey)}
                </Text>
                <TouchableOpacity onPress={() => refetch()} className="mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: copy.soft }}>
                  <Text style={{ color: copy.accent, fontFamily: 'IRANSans-Bold', fontSize: 12 }}>
                    {t('providerDirectory.tryAgain')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-5">
              <ActivityIndicator color={copy.accent} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
}

function ProviderCard({
  provider,
  providerType,
  copy,
  onConsultation,
}: {
  provider: ProviderListItem;
  providerType: ProviderListType;
  copy: ProviderCopy;
  onConsultation: () => void;
}) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const isDoctor = providerType === 'doctor';
  const name = getFullName(provider, t('NoData'));
  const subtitle = isDoctor
    ? provider.expertise || t('roles.Doctor')
    : provider.field || t('roles.Psychologist');
  const canConsult = !(isDoctor && provider.source === 'manual') && Boolean(getProviderId(provider));
  const [avatarFailed, setAvatarFailed] = useState(false);
  const avatarUri = provider.profilePhotoUrl?.trim();
  const showAvatar = Boolean(avatarUri) && !avatarFailed;

  return (
    <View
      className="rounded-3xl mb-3 overflow-hidden border"
      style={{
        backgroundColor: isDark ? colors.card : '#ffffff',
        borderColor: isDark ? colors.border : `${copy.accent}26`,
      }}
    >
      <View className="h-1.5" style={{ backgroundColor: copy.accent }} />
      <View className="p-4">
        <View className="items-center" style={direction.row}>
          <View
            className="w-16 h-16 rounded-2xl overflow-hidden items-center justify-center"
            style={{ backgroundColor: copy.soft }}
          >
            {showAvatar ? (
              <Image
                source={{
                  uri: encodeURI(avatarUri!),
                  headers: {
                    Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0',
                  },
                }}
                style={{ width: 64, height: 64 }}
                resizeMode="cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <Text style={{ color: copy.accent, fontFamily: 'IRANSans-Bold', fontSize: 18 }}>
                {getInitials(provider)}
              </Text>
            )}
          </View>

          <View className="flex-1 mx-3" style={direction.startItems}>
            <View className="items-center gap-2" style={direction.row}>
              <Text
                style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 16, flexShrink: 1, ...direction.text }}
                numberOfLines={1}
              >
                {name}
              </Text>
              <View className="px-2 py-1 rounded-full" style={{ backgroundColor: copy.soft }}>
                <Text style={{ color: copy.accent, fontFamily: 'IRANSans-Bold', fontSize: 10 }}>
                  {t(copy.badgeKey)}
                </Text>
              </View>
            </View>
            <Text
              style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginTop: 5, ...direction.text }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-4">
          {isDoctor ? (
            <>
              <InfoChip label={t('providerDirectory.medicalId')} value={provider.medicalId} icon="barcode-outline" accent={copy.accent} />
              <InfoChip label={t('shahr')} value={provider.city} icon="location-outline" accent={copy.accent} />
            </>
          ) : (
            <>
              <InfoChip label={t('providerDirectory.licenseNumber')} value={provider.licenseNumber} icon="barcode-outline" accent={copy.accent} />
              <InfoChip label={t('providerDirectory.province')} value={provider.province} icon="map-outline" accent={copy.accent} />
              <InfoChip label={t('shahr')} value={provider.city} icon="location-outline" accent={copy.accent} />
            </>
          )}
        </View>

        <Button
          type="primary"
          fullWidth
          disabled={!canConsult}
          onPress={onConsultation}
          className="mt-4"
          icon={<Ionicons name="videocam-outline" size={18} color="#ffffff" />}
        >
          {t(copy.actionKey)}
        </Button>
      </View>
    </View>
  );
}

function InfoChip({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value?: string | null;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
}) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  if (!value) return null;

  return (
    <View
      className="px-3 py-2 rounded-xl border items-center"
      style={{
        flexDirection: direction.isRTL ? 'row-reverse' : 'row',
        backgroundColor: isDark ? colors.surface : '#f8fafc',
        borderColor: isDark ? colors.border : '#eef2f7',
      }}
    >
      <Ionicons name={icon} size={13} color={accent} />
      <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 11, marginHorizontal: 5 }}>
        {label}
      </Text>
      <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 11, maxWidth: 120 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
