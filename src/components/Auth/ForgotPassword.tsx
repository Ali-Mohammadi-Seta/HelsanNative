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

const PHONE_LENGTH = 11;

interface ForgotPasswordProps {
  onChallengeReceived: (challenge: string, phone: string) => void;
}

export default function ForgotPassword({ onChallengeReceived }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toastLanguage = direction.isRTL ? 'fa' : 'en';

  const validatePhone = (): boolean => {
    if (!phone.trim()) {
      setError(t('rules.requiredField'));
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      setError(t('rules.enterNumber'));
      return false;
    }
    if (phone.length !== PHONE_LENGTH) {
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
      const response = await apiClient.get(endpoints.changePassword1, { params: { phone } });

      if (response?.data) {
        showToast({ type: 'success', message: response.data, fallback: t('success'), language: toastLanguage });
        onChallengeReceived(response.data?.challenge, phone);
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
      <View style={{ marginBottom: 20, alignItems: direction.isRTL ? 'flex-end' : 'flex-start' }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : '#fef9c3',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Ionicons name="key-outline" size={26} color="#f59e0b" />
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
          {t('reminderInstruction')}
        </Text>
      </View>

      <FloatingInput
        label={t('mobileNumber')}
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setError(text && !/^\d*$/.test(text) ? t('rules.enterNumber') : '');
        }}
        type="number"
        error={error}
        placeholder="09*********"
        disabled={loading}
        dir={direction.dir}
        localizeDigits={false}
        maxLength={PHONE_LENGTH}
      />

      <View style={{ marginTop: 8 }}>
        <Button
          type="primary"
          size="large"
          onPress={requestChangePassword}
          loading={loading}
          fullWidth
        >
          {t('passwordReminder')}
        </Button>
      </View>
    </ScrollView>
  );
}
