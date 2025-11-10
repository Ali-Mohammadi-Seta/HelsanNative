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

interface ForgotPasswordProps {
  onChallengeReceived: (challenge: string, phone: string) => void;
}

export default function ForgotPassword({ onChallengeReceived }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (): boolean => {
    if (!phone || phone.length !== 11) {
      setError(t('rules.phonNumDigit'));
      return false;
    }
    setError('');
    return true;
  };

  const requestChangePassword = async () => {
    if (!validatePhone()) return;

    setLoading(true);
    try {
      const response = await apiClient.get(endpoints.changePassword1, { phone });

      if (response?.data) {
        Toast.show({
          type: 'success',
          text1: response.data?.messageFa || t('success'),
        });
        onChallengeReceived(response.data?.challenge, phone);
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
        {t('reminderInstruction')}
      </Text>

      <FloatingInput
        label={t('mobileNumber')}
        value={phone}
        onChangeText={setPhone}
        type="number"
        error={error}
        placeholder="09*********"
        disabled={loading}
        dir="ltr"
      />

      <Button
        type="primary"
        size="large"
        onPress={requestChangePassword}
        loading={loading}
        fullWidth
        className="mt-4"
      >
        {t('passwordReminder')}
      </Button>
    </ScrollView>
  );
}