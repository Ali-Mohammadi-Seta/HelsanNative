import AppProviders from '@/providers/AppProviders';
import '@/styles/global.css';
import AppToast from '@/components/Toast/AppToast';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { router, Stack, usePathname } from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Alert, BackHandler, I18nManager, Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// The app supports Persian and English in the same binary. React Native's
// process-wide RTL switch requires a restart and leaks into the wrong locale,
// so screens apply direction from i18n instead.
if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}
export default function RootLayout() {
  return (
    <AppProviders>
      <SafeAreaProvider>
        <RootLayoutContent />
      </SafeAreaProvider>
    </AppProviders>
  );
}

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const isHome = pathname === '/' || pathname === '/home' || pathname === '/(tabs)/home';
      const isMainTab = ['/explore', '/map', '/profile', '/(tabs)/explore', '/(tabs)/map', '/(tabs)/profile'].includes(pathname);

      if (isHome) {
        const isFa = i18n.resolvedLanguage?.startsWith('fa');
        Alert.alert(
          isFa ? 'خروج از برنامه' : 'Exit app',
          isFa ? 'آیا می‌خواهید از برنامه خارج شوید؟' : 'Do you want to close the app?',
          [
            { text: isFa ? 'خیر' : 'Cancel', style: 'cancel' },
            { text: isFa ? 'بله، خروج' : 'Exit', style: 'destructive', onPress: BackHandler.exitApp },
          ],
        );
        return true;
      }

      if (isMainTab) {
        router.replace('/(tabs)/home');
        return true;
      }

      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/home');
      return true;
    });

    return () => subscription.remove();
  }, [i18n, pathname]);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <StatusBar hidden />
      {Platform.OS === 'android' && (
        <NavigationBar hidden style={isDark ? 'light' : 'dark'} />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: direction.isRTL ? 'slide_from_left' : 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <AppToast />
    </View>
  );
}
