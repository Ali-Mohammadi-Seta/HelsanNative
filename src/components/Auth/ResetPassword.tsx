// src/components/Auth/ResetPassword.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import FloatingInput from '@/components/Input/FloatingInput';
import Button from '@/components/Button';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';

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
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const toastLanguage = direction.isRTL ? 'fa' : 'en';

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
        showToast({ type: 'success', message: response.data, fallback: t('success'), language: toastLanguage });
        onPasswordChanged();
      }
    } catch (error: any) {
      showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 24 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 20, alignItems: direction.isRTL ? 'flex-end' : 'flex-start' }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Ionicons name="lock-closed-outline" size={26} color={colors.primary} />
        </View>
        <Text
          style={{
            fontFamily: 'IRANSans',
            fontSize: 14,
            lineHeight: 22,
            color: colors.textSecondary,
            ...direction.text,
          }}
        >
          {t('newPass')}
        </Text>
      </View>

      <FloatingInput
        label={t('user.password')}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        type="password"
        error={errors.password}
        disabled={loading}
        passwordToggle
      />

      <FloatingInput
        label={t('user.confirmPassword')}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors((e) => ({ ...e, confirmPassword: undefined }));
        }}
        type="password"
        error={errors.confirmPassword}
        disabled={loading}
        passwordToggle
      />

      <View style={{ marginTop: 8 }}>
        <Button
          type="primary"
          size="large"
          onPress={changePassword}
          loading={loading}
          fullWidth
        >
          {t('changePass')}
        </Button>
      </View>
    </ScrollView>
  );
}
