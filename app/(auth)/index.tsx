// app/(auth)/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from '@/screens/Auth/LoginScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className={`border-b ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-200'}`}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons
              name={i18n.language === 'fa' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color={isDark ? colors.text : '#000000'}
            />
          </TouchableOpacity>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {t('account')}
          </Text>
          <View className="w-10" />
        </View>

        {/* Tabs */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab('login')}
            className="flex-1 items-center pb-3 border-b-2"
            style={{
              borderBottomColor: activeTab === 'login' ? colors.primary : 'transparent',
            }}
          >
            <Text
              className={`text-base font-bold ${
                activeTab === 'login'
                  ? 'text-primary'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {t('user.login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('register')}
            className="flex-1 items-center pb-3 border-b-2"
            style={{
              borderBottomColor: activeTab === 'register' ? colors.primary : 'transparent',
            }}
          >
            <Text
              className={`text-base font-bold ${
                activeTab === 'register'
                  ? 'text-primary'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {t('Register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'login' ? <LoginScreen /> : <RegisterScreen />}
    </View>
  );
}