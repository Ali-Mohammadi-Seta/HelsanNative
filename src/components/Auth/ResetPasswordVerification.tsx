import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import OtpInput from '@/components/Input/OtpInput';
import Button from '@/components/Button';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';
import { formatCountdown } from '@/lib/format/digits';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows } from '@/styles/theme';

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
  const direction = useDirection();

  const [code, setCode] = useState('');
  const [expiration, setExpiration] = useState(120);
  const [loading, setLoading] = useState(false);
  const toastLanguage = direction.isRTL ? 'fa' : 'en';

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
        showToast({ type: 'success', message: response.data, fallback: t('success'), language: toastLanguage });
        onVerified(otpCode);
      }
    } catch (error: any) {
      showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(endpoints.changePassword1, { params: { phone } });

      if (response?.data) {
        showToast({ type: 'success', message: response.data, fallback: t('success'), language: toastLanguage });
        setExpiration(120);
        setCode('');
      }
    } catch (error: any) {
      showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
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

  const remainingTime = formatCountdown(expiration, toastLanguage);

  return (
    <View style={{ padding: 18, backgroundColor: colors.background, flex: 1, justifyContent: 'center' }}>
      <View
        style={[
          shadows.lg,
          {
            borderRadius: 26,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.glassBorder,
            backgroundColor: isDark ? colors.glass : 'rgba(255,255,255,0.78)',
          },
        ]}
      >
        <LinearGradient
          colors={isDark ? ['rgba(34,197,94,0.14)', 'rgba(20,184,166,0.06)'] : ['#ecfdf5', '#ffffff']}
          style={{ padding: 20 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <View
              style={{
                width: 62,
                height: 62,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primarySoft,
                marginBottom: 14,
              }}
            >
              <Ionicons name="keypad-outline" size={30} color={colors.primary} />
            </View>
            <Text
              style={{
                color: colors.text,
                fontFamily: 'IRANSans-Bold',
                fontSize: 20,
                textAlign: 'center',
                writingDirection: direction.dir,
              }}
            >
              {t('verifyCode')}
            </Text>
            <Text
              style={{
                fontFamily: 'IRANSans',
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
                marginTop: 8,
                writingDirection: direction.dir,
              }}
            >
              {t('resetText2')}{' '}
              <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', writingDirection: 'ltr' }}>{phone}</Text>{' '}
              {t('resetText3')}
            </Text>
          </View>

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
          >
            {t('verifyCode')}
          </Button>

          {expiration !== 0 ? (
            <View
              style={{
                alignSelf: 'center',
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 7,
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(22,163,74,0.08)',
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                marginTop: 16,
              }}
            >
              <Ionicons name="time-outline" size={17} color={colors.primary} />
              <Text
                style={{
                  color: colors.text,
                  fontFamily: 'IRANSans',
                  fontSize: 13,
                  writingDirection: direction.dir,
                }}
              >
                {t('resetText')}{' '}
                <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', writingDirection: 'ltr' }}>
                  {remainingTime}
                </Text>
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={resendCode}
              disabled={loading}
              style={{
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                gap: 7,
                paddingVertical: 9,
              }}
            >
              <Ionicons name="refresh" size={19} color={colors.primary} />
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: 'IRANSans-Bold',
                  fontSize: 13,
                  writingDirection: direction.dir,
                }}
              >
                {t('sendAgain')}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={onPhoneEdit}
            style={{
              flexDirection: direction.isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 18,
              gap: 7,
            }}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'IRANSans',
                fontSize: 13,
                writingDirection: direction.dir,
              }}
            >
              {t('editNumberPhone')}
            </Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
