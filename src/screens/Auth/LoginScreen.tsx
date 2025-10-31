// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { FloatingInput, Button } from '@/components';
import { useLogin } from '@/lib/hooks/auth/useLogin';
import { setUserLoginFormValues } from '@/redux/slices/userSlice';
import { setLoginStep } from '@/redux/slices/authSlice';
import { useTheme } from '@/styles/theme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; nationalId?: string }>({});

  const loginMutation = useLogin();

  const validateForm = (): boolean => {
    const newErrors: { phone?: string; nationalId?: string } = {};
    
    if (!phone || phone.length !== 11) {
      newErrors.phone = t('rules.phonNumDigit');
    }
    
    if (!nationalId || nationalId.length !== 10) {
      newErrors.nationalId = t('rules.natCodeDigit');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const payload = { phone, nationalId };

    loginMutation.mutate(payload, {
      onSuccess: (data) => {
        dispatch(setUserLoginFormValues(payload));
        dispatch(setLoginStep('loginVerification'));
        Toast.show({
          type: 'success',
          text1: data?.messageFa || t('success'),
        });
        router.push('/(auth)/verification?type=login');
      },
      onError: (error: any) => {
        const errorCode = error.response?.data?.error?.errorCode;
        
        if (errorCode === 'PREVIOUS_OTP_STILL_VALID') {
          dispatch(setUserLoginFormValues(payload));
          dispatch(setLoginStep('loginVerification'));
          router.push('/(auth)/verification?type=login');
        }
        
        Toast.show({
          type: 'error',
          text1: error.response?.data?.messageFa || t('error'),
        });
      },
    });
  };

  const healthMinistryLogin = () => {
    const callbackUrl = 'your-callback-url'; // Add to config
    const url = `https://ssocore.behdasht.gov.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=salamhealth.ir&state=state1&redirect_uri=${callbackUrl}`;
    // TODO: Implement WebBrowser for SSO
    Toast.show({ type: 'info', text1: t('healthMinistry') });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        className={isDark ? 'bg-background-dark' : 'bg-white'}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <FloatingInput
          label={t('mobileNumber')}
          value={phone}
          onChangeText={setPhone}
          type="number"
          error={errors.phone}
          placeholder="09*********"
          disabled={loginMutation.isPending}
          dir="ltr"
        />

        <FloatingInput
          label={t('nationalId')}
          value={nationalId}
          onChangeText={setNationalId}
          type="number"
          error={errors.nationalId}
          disabled={loginMutation.isPending}
        />

        <Button
          type="primary"
          size="large"
          onPress={handleLogin}
          loading={loginMutation.isPending}
          fullWidth
          className="mt-4"
        >
          {t('accountLogin')}
        </Button>

        <View className="my-6 border-b border-gray-300 relative">
          <View className={`absolute -top-3 self-center px-2 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('loginOtherWays')}
            </Text>
          </View>
        </View>

        <Button
          type="primary"
          variant="link"
          size="large"
          onPress={healthMinistryLogin}
          disabled={loginMutation.isPending}
          fullWidth
          className="border border-primary"
        >
          {t('healthMinistry')}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}