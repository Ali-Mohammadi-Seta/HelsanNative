import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppProviders from '@/providers/AppProviders';
import '@/styles/global.css';
import { StatusBar } from 'expo-status-bar';
import { useAppSelector } from '@/redux/hooks';

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
  const mode = useAppSelector((s) => s.theme.mode);
  const isDark = mode === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
      <Toast />
    </>
  );
}