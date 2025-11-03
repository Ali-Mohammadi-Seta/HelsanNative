// src/components/Auth/ResetPasswordVerification.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { OtpInput, Button } from '@/components';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useTheme } from '@/styles/theme';

interface ResetPasswordVerificationProps {
  phone: string;
  onVerified: (code: string) => void;
  onPhoneEdit: () => void;
}

export default function ResetPasswordVerification({
  phone,
  onVerified,
  onPhoneEdit,
}: ResetPasswordVerificationProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const [code, setCode] = useState('');
  const [expiration, setExpiration] = useState(120);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expiration > 0) {
      const timer = setTimeout(() => setExpiration((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiration]);

  const verifyOTP = async (otpCode: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post(endpoints.verifyOTP1, {
        phone,
        code: otpCode,
      });

      if (response?.data) {
        Toast.show({
          type: 'success',
          text1: response.data?.messageFa || t('success'),
        });
        onVerified(otpCode);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.messageFa || t('error'),
      });
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(endpoints.changePassword1, { phone });

      if (response?.data) {
        Toast.show({
          type: 'success',
          text1: response.data?.messageFa || t('success'),
        });
        setExpiration(120);
        setCode('');
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

  const handleOtpChange = (text: string) => {
    setCode(text);
    if (text.length === 6) {
      verifyOTP(text);
    }
  };

  return (
    <View className={`p-5 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
      <Text className={`text-sm text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {t('resetText2')}
        <Text className="text-primary"> {phone} </Text>
        {t('resetText3')}
      </Text>

      <OtpInput
        length={6}
        value={code}
        onChangeText={handleOtpChange}
        disabled={loading}
        autoFocus
        dir="ltr"
      />

      <Button
        type="primary"
        size="large"
        onPress={() => code.length === 6 && verifyOTP(code)}
        loading={loading}
        disabled={code.length !== 6}
        fullWidth
        className="mt-6"
      >
        {t('verifyCode')}
      </Button>

      {expiration !== 0 ? (
        <Text className={`text-center mt-6 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('resetText')} <Text className="text-primary">{expiration}</Text> {t('second')}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={resendCode}
          disabled={loading}
          className="flex-row items-center justify-center mt-6"
        >
          <Ionicons name="refresh" size={20} color={colors.primary} />
          <Text className="text-primary font-bold ml-2">{t('sendAgain')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onPhoneEdit}
        className="flex-row items-center justify-center mt-6"
      >
        <Ionicons name="pencil" size={16} color={colors.primary} />
        <Text className="text-primary ml-2">{t('editNumberPhone')}</Text>
      </TouchableOpacity>
    </View>
  );
}