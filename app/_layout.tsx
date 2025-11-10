import React, { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import AppProviders from '@/providers/AppProviders';
import '@/styles/global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

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
  return (
    <>
      <StatusBar style="auto" />
      <Slot />
      <Toast />
    </>
  );
}