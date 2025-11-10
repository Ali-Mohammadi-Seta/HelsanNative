// src/components/Auth/ResetPassword.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

// ✅ CHANGED - Direct imports
import FloatingInput from '@/components/Input/FloatingInput';
import Button from '@/components/Button';

import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useTheme } from '@/styles/theme';

// ... rest of the file stays exactly the same

interface ResetPasswordProps {
  challenge: string;
  verifyCode: string;
  phone: string;
  onPasswordChanged: () => void;
}

export default function ResetPassword({
  challenge,
  verifyCode,
  phone,
  onPasswordChanged,
}: ResetPasswordProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password || password.length < 8) {
      newErrors.password = t('error.passwordError');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('error.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(endpoints.changePassword1, {
        challenge,
        newPassword: password,
        code: verifyCode,
        phone,
      });

      if (response?.data) {
        Toast.show({
          type: 'success',
          text1: response.data?.messageFa || t('success'),
        });
        onPasswordChanged();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.messageFa || t('error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className={isDark ? 'bg-background-dark' : 'bg-white'}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {t('newPass')}
      </Text>

      <FloatingInput
        label={t('user.password')}
        value={password}
        onChangeText={setPassword}
        type="password"
        error={errors.password}
        disabled={loading}
        passwordToggle
      />

      <FloatingInput
        label={t('user.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        type="password"
        error={errors.confirmPassword}
        disabled={loading}
        passwordToggle
      />

      <Button
        type="primary"
        size="large"
        onPress={changePassword}
        loading={loading}
        fullWidth
        className="mt-4"
      >
        {t('changePass')}
      </Button>
    </ScrollView>
  );
}