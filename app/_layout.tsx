// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
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

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

useEffect(() => {
  const initialize = async () => {
    try {
      console.log('🚀 App initializing...');
      
      // ✅ TEMPORARY: Clear language cache (remove this after first run)
      await AsyncStorage.removeItem('@app_language');
      
      // Load fonts
      await loadFonts();
      console.log('✅ Fonts loaded');
      
      // Load saved theme
      store.dispatch(loadTheme() as any);
      console.log('✅ Theme loaded');
      
      // Restore auth session
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

  // Show loading screen while initializing
  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      {/* Root Stack Navigator - handles ALL navigation */}
      <Stack
        screenOptions={{
          headerShown: false, // We'll create custom headers
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {/* Main app with tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Auth modal (full screen) */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            presentation: 'fullScreenModal',
            headerShown: false,
          }} 
        />
        
        {/* Protected screens */}
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        
        {/* Public detail screens */}
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

      {/* Toast notifications (shows at top of everything) */}
      <Toast />
    </Provider>
  );
}