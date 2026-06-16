import AppProviders from '@/providers/AppProviders';
import '@/styles/global.css';
import { useTheme } from '@/styles/theme';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { I18nManager, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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
  const { isDark } = useTheme();

  // Apply dark class to root View for NativeWind
  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
      <Toast />
    </View>
  );
}
