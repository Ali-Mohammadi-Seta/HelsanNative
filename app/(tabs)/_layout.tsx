import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn);
  const writingDirection = i18n.language === 'fa' ? 'rtl' : 'ltr';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textSecondary : colors.textTertiary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.card : colors.background,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          flexDirection: writingDirection === 'rtl' ? 'row-reverse' : 'row',
        },
        tabBarLabelStyle: {
          fontFamily: 'IRANSans',
          fontSize: 12,
          writingDirection,
          color: isDark ? colors.text : colors.textSecondary,
          ...(Platform.OS === 'ios' ? { textAlign: 'center' as const } : {}),
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('search'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('locator'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('account'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                isLoggedIn
                  ? (focused ? 'person' : 'person-outline')
                  : (focused ? 'log-in' : 'log-in-outline')
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}