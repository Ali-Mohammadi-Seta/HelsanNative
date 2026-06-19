import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDirection } from '@/lib/hooks/useDirection';
import { RootState } from '@/redux/store';
import { useUserProfile } from '@/lib/api/useAuth';
import { useTheme, shadows } from '@/styles/theme';
import { Image, Platform, View, StyleSheet, type ColorValue } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

function TabIcon({
  name,
  focused,
  color,
  size,
  avatarUri,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
  avatarUri?: string;
}) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 2,
      }}
    >
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
      {avatarUri ? (
        <Image
          source={{ uri: encodeURI(avatarUri) }}
          style={{
            width: size + 4,
            height: size + 4,
            borderRadius: (size + 4) / 2,
            borderWidth: focused ? 2 : 1,
            borderColor: focused ? colors.primary : colors.border,
          }}
        />
      ) : (
        <Ionicons name={name} size={size} color={color} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn);
  const { data: userProfile } = useUserProfile(isLoggedIn);
  const avatarUri = isLoggedIn
    ? ((userProfile as any)?.profilePhotoUrl || (userProfile as any)?.profileImage || '').trim()
    : '';
  const tabScreens = [
    {
      name: 'home',
      title: t('home'),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon
          name={focused ? 'home' : 'home-outline'}
          focused={focused}
          color={String(color)}
          size={size}
        />
      ),
    },
    {
      name: 'explore',
      title: t('search'),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon
          name={focused ? 'search' : 'search-outline'}
          focused={focused}
          color={String(color)}
          size={size}
        />
      ),
    },
    {
      name: 'map',
      title: t('locator'),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon
          name={focused ? 'map' : 'map-outline'}
          focused={focused}
          color={String(color)}
          size={size}
        />
      ),
    },
    {
      name: 'profile',
      title: t('account'),
      icon: ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
        <TabIcon
          name={
            isLoggedIn
              ? (focused ? 'person' : 'person-outline')
              : (focused ? 'log-in' : 'log-in-outline')
          }
          focused={focused}
          color={String(color)}
          size={size}
          avatarUri={avatarUri || undefined}
        />
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
          elevation: 0, // Remove shadow on Android for blur to work cleanly
        },
        tabBarBackground: () => <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={{ flex: 1 }} />,
        tabBarLabelStyle: {
          fontFamily: 'IRANSans-Bold',
          fontSize: 11,
          writingDirection: direction.dir,
          marginTop: 2,
          ...(Platform.OS === 'ios' ? { textAlign: 'center' as const } : {}),
        },
        headerShown: false,
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
