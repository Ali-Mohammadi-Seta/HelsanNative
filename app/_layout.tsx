// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../src/redux/store';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { loadFonts } from '../src/styles/fonts';
import { loadTheme } from '../src/redux/slices/themeSlice';
import { restoreAuthSession } from '../src/redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import '@/translations/i18n';
import '@/styles/global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ❌ REMOVE THIS - Not compatible with React Native
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 App initializing...');

        await AsyncStorage.removeItem('@app_language');

        await loadFonts();
        console.log('✅ Fonts loaded');

        store.dispatch(loadTheme() as any);
        console.log('✅ Theme loaded');

        store.dispatch(restoreAuthSession() as any);
        console.log('✅ Auth session restored');

        setAppReady(true);
        console.log('🎉 App ready!');
      } catch (error) {
        console.error('❌ App initialization error:', error);
        setAppReady(true);
      }
    };

    initialize();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen
            name="medical-centers"
            options={{
              title: 'Medical Centers',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="doctors"
            options={{
              title: 'Doctors',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="pharmacies"
            options={{
              title: 'Pharmacies',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="healthcare-companies"
            options={{
              title: 'Healthcare Companies',
              headerShown: true,
            }}
          />
        </Stack>

        <Toast />
      </Provider>
      {/* ❌ REMOVE THIS LINE - DevTools don't work in React Native */}
      {/* {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}