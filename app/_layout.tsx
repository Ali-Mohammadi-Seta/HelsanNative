import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppProviders from '@/providers/AppProviders';
import '@/styles/global.css';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTheme } from '@/styles/theme';

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