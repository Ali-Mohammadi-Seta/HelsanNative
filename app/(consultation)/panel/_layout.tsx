import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { View, StyleSheet, Platform, TouchableOpacity, Text, type ColorValue } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';

function TabIcon({
  name,
  focused,
  color,
  size,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 2 }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            width: 20,
            height: 3,
            borderRadius: 2,
            backgroundColor: colors.primary,
          }}
        />
      )}
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function ConsultationHeader() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        flexDirection: direction.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="medical" size={24} color={colors.primary} />
        <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 18, color: colors.text }}>
          {t('homePage.consultationBannerTitle', { defaultValue: 'مشاوره پزشکی' })}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.replace('/(tabs)/home')}
        style={{
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 4,
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderRadius: 16,
        }}
      >
        <Ionicons name={direction.isRTL ? 'arrow-forward' : 'arrow-back'} size={16} color={colors.textSecondary} />
        <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 12, color: colors.textSecondary }}>
          {t('return', { defaultValue: 'بازگشت به هلسان' })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ConsultationTabsLayout() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();

  const tabScreens = [
    {
      name: 'home',
      title: t('home', { defaultValue: 'خانه' }),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={String(color)} size={size} />
      ),
    },
    {
      name: 'providers',
      title: t('doctors', { defaultValue: 'پزشکان' }),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} color={String(color)} size={size} />
      ),
    },
    {
      name: 'tickets',
      title: t('messages', { defaultValue: 'پیام‌ها' }),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} color={String(color)} size={size} />
      ),
    },
    {
      name: 'appointments',
      title: t('calendar', { defaultValue: 'نوبت‌ها' }),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} color={String(color)} size={size} />
      ),
    },
    {
      name: 'profile',
      title: t('profile', { defaultValue: 'پروفایل' }),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={String(color)} size={size} />
      ),
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
          position: 'absolute',
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 70 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8) + 6,
          paddingTop: 8,
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          elevation: 0,
        },
        tabBarBackground: () => <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={{ flex: 1 }} />,
        tabBarLabelStyle: {
          fontFamily: 'IRANSans-Bold',
          fontSize: 11,
          writingDirection: direction.dir,
          marginTop: 2,
          ...(Platform.OS === 'ios' ? { textAlign: 'center' as const } : {}),
        },
        header: () => <ConsultationHeader />,
        headerShown: true,
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: screen.icon,
          }}
        />
      ))}
    </Tabs>
  );
}
