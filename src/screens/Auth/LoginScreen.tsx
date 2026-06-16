import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { Button, FloatingInput } from '@/components';
import {
  applyAuthResponse,
  getSsoRedirectUrl,
  startHealthMinistryAuth,
  submitHealthMinistryCode,
} from '@/lib/auth/sso';
import { useLogin } from '@/lib/hooks/auth/useLogin';
import { setLoginStep } from '@/redux/slices/authSlice';
import { setUserLoginFormValues } from '@/redux/slices/userSlice';
import type { AppDispatch } from '@/redux/store';
import { useTheme } from '@/styles/theme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { isDark } = useTheme();

  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [healthMinistryLoading, setHealthMinistryLoading] = useState(false);
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

  const healthMinistryLogin = async () => {
    setHealthMinistryLoading(true);

    try {
      const code = await startHealthMinistryAuth();
      if (!code) return;

      const data = await submitHealthMinistryCode(code);
      await applyAuthResponse(data, dispatch);

      Toast.show({ type: 'success', text1: (data as any)?.messageFa || t('success') });

      const redirectUrl = getSsoRedirectUrl(data);
      if (redirectUrl) {
        router.replace({ pathname: '/doctors-consultation', params: { url: redirectUrl } });
        return;
      }

      router.replace('/(tabs)/home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.messageFa || t('error'),
      });
    } finally {
      setHealthMinistryLoading(false);
    }
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
          disabled={loginMutation.isPending || healthMinistryLoading}
          dir="ltr"
        />

        <FloatingInput
          label={t('nationalId')}
          value={nationalId}
          onChangeText={setNationalId}
          type="number"
          error={errors.nationalId}
          disabled={loginMutation.isPending || healthMinistryLoading}
          dir="ltr"
        />

        <Button
          type="primary"
          size="large"
          onPress={handleLogin}
          loading={loginMutation.isPending}
          disabled={healthMinistryLoading}
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
          variant="outline"
          size="large"
          onPress={healthMinistryLogin}
          loading={healthMinistryLoading}
          disabled={loginMutation.isPending}
          fullWidth
        >
          {t('healthMinistry')}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
