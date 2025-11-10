import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';
import { View } from 'react-native';
import { store } from '@/redux/store';
import i18n from '@/translations/i18n';
import { loadTheme } from '@/redux/slices/themeSlice';
import { restoreAuthSession } from '@/redux/slices/authSlice';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'IRANSans': require('@/assets/fonts/IRANSansWeb.ttf'),
    'IRANSans-Bold': require('@/assets/fonts/IRANSansWeb_Bold.ttf'),
    'IRANSans-Medium': require('@/assets/fonts/IRANSansWeb_Medium.ttf'),
    'IRANSans-Light': require('@/assets/fonts/IRANSansWeb_Light.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load theme and auth state
        await store.dispatch(loadTheme() as any);
        await store.dispatch(restoreAuthSession() as any);
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </QueryClientProvider>
    </Provider>
  );
}