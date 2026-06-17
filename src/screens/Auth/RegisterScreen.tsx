import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, FloatingInput, Modal } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DatePickerJalali from '@/components/DatePicker/DatePickerJalali';
import {
  applyAuthResponse,
  getSsoRedirectUrl,
  startHealthMinistryAuth,
  submitHealthMinistryCode,
} from '@/lib/auth/sso';
import { useRegister } from '@/lib/hooks/auth/useRegister';
import { setUserRegisterFormValues } from '@/redux/slices/userSlice';
import type { AppDispatch } from '@/redux/store';
import { shadows, useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';

const PHONE_LENGTH = 11;
const NATIONAL_ID_LENGTH = 10;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [healthMinistryLoading, setHealthMinistryLoading] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    nationalId?: string;
    birthDate?: string;
  }>({});

  const registerMutation = useRegister();
  const toastLanguage = direction.isRTL ? 'fa' : 'en';

  const updateNumberField = (
    field: 'phone' | 'nationalId',
    text: string,
    setter: (value: string) => void,
  ) => {
    setter(text);
    setErrors((current) => ({
      ...current,
      [field]: text && !/^\d*$/.test(text) ? t('rules.enterNumber') : undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!phone.trim()) {
      newErrors.phone = t('rules.requiredField');
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = t('rules.enterNumber');
    } else if (phone.length !== PHONE_LENGTH) {
      newErrors.phone = t('rules.phonNumDigit');
    }

    if (!nationalId.trim()) {
      newErrors.nationalId = t('rules.requiredField');
    } else if (!/^\d+$/.test(nationalId)) {
      newErrors.nationalId = t('rules.enterNumber');
    } else if (nationalId.length !== NATIONAL_ID_LENGTH) {
      newErrors.nationalId = t('rules.natCodeDigit');
    }

    if (!birthDate) {
      newErrors.birthDate = t('rules.requiredField');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    const payload = {
      phone,
      nationalId,
      birthDate,
    };

    registerMutation.mutate(payload, {
      onSuccess: (data) => {
        dispatch(setUserRegisterFormValues(payload));
        showToast({ type: 'success', message: data, fallback: t('success'), language: toastLanguage });
        router.push('/(auth)/verification?type=register');
      },
      onError: (error: any) => {
        const errorCode = error.response?.data?.error?.errorCode;

        if (
          error.response?.status === 429 &&
          errorCode === 'PREVIOUS_OTP_STILL_VALID'
        ) {
          dispatch(setUserRegisterFormValues(payload));
          router.push('/(auth)/verification?type=register');
        }

        showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
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

      showToast({ type: 'success', message: data, fallback: t('success'), language: toastLanguage });

      const redirectUrl = getSsoRedirectUrl(data);
      if (redirectUrl) {
        router.replace({ pathname: '/doctors-consultation', params: { url: redirectUrl } });
        return;
      }

      router.replace('/(tabs)/home');
    } catch (error: any) {
      showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
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
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 20, paddingTop: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            shadows.md,
            {
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: isDark ? colors.card : '#ffffff',
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#0f241a', '#172b21'] : ['#ecfdf5', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 18 }}
          >
            <View style={[{ alignItems: 'center', gap: 12 }, direction.row]}>
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  backgroundColor: colors.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person-add-outline" size={27} color={colors.primary} />
              </View>
              <View style={[{ flex: 1 }, direction.startItems]}>
                <Text
                  style={{
                    fontFamily: 'IRANSans-Bold',
                    fontSize: 20,
                    color: colors.text,
                    ...direction.text,
                  }}
                >
                  {t('Register')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'IRANSans',
                    fontSize: 13,
                    lineHeight: 22,
                    color: colors.textSecondary,
                    marginTop: 4,
                    ...direction.text,
                  }}
                >
                  {`${t('mobileNumber')} / ${t('nationalId')} / ${t('birth')}`}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={{ padding: 18, paddingTop: 10 }}>
            <FloatingInput
              label={t('mobileNumber')}
              value={phone}
              onChangeText={(text) => updateNumberField('phone', text, setPhone)}
              type="number"
              error={errors.phone}
              placeholder="09*********"
              disabled={registerMutation.isPending || healthMinistryLoading}
              dir={direction.dir}
              localizeDigits={false}
              maxLength={PHONE_LENGTH}
            />

            <FloatingInput
              label={t('nationalId')}
              value={nationalId}
              onChangeText={(text) => updateNumberField('nationalId', text, setNationalId)}
              type="number"
              error={errors.nationalId}
              placeholder="1234567890"
              disabled={registerMutation.isPending || healthMinistryLoading}
              maxLength={NATIONAL_ID_LENGTH}
              dir={direction.dir}
              localizeDigits={false}
            />

            <View style={{ marginBottom: 16 }}>
              <Button
                type="secondary"
                variant="outline"
                onPress={() => setShowDatePicker(true)}
                disabled={registerMutation.isPending || healthMinistryLoading}
                fullWidth
                icon={<Ionicons name="calendar-outline" size={18} color={birthDate ? colors.primary : colors.textTertiary} />}
              >
                {birthDate || t('birth')}
              </Button>
              {errors.birthDate && (
                <View
                  style={[
                    {
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 6,
                      marginHorizontal: 4,
                      flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                >
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      fontFamily: 'IRANSans',
                      writingDirection: direction.dir,
                      textAlign: direction.isRTL ? 'right' : 'left',
                      flex: 1,
                    }}
                  >
                    {errors.birthDate}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 4 }}>
              <Button
                type="primary"
                size="large"
                onPress={handleRegister}
                loading={registerMutation.isPending}
                disabled={healthMinistryLoading}
                fullWidth
              >
                {t('registering')}
              </Button>
            </View>
          </View>
        </View>

        <View
          style={{
            marginVertical: 22,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text
            style={{
              paddingHorizontal: 14,
              fontFamily: 'IRANSans',
              fontSize: 12,
              color: colors.textTertiary,
              writingDirection: direction.dir,
            }}
          >
            {t('registeringOtherWays')}
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        <Button
          type="primary"
          variant="outline"
          size="large"
          onPress={healthMinistryLogin}
          loading={healthMinistryLoading}
          disabled={registerMutation.isPending}
          fullWidth
          icon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />}
        >
          {t('healthMinistry')}
        </Button>
      </ScrollView>

      <Modal
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title={t('birth')}
        closable
        size="lg"
        disableScrollView
      >
        <DatePickerJalali
          selectedDate={birthDate}
          onDateChange={(date) => {
            setBirthDate(date);
            setErrors((current) => ({ ...current, birthDate: undefined }));
            setShowDatePicker(false);
          }}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}
