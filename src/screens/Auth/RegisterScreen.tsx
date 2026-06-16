import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { Button, FloatingInput, Modal } from '@/components';
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
import { useTheme } from '@/styles/theme';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { isDark } = useTheme();

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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!phone || phone.length !== 11) {
      newErrors.phone = t('rules.phonNumDigit');
    }

    if (!nationalId || nationalId.length !== 10) {
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
        Toast.show({
          type: 'success',
          text1: data?.messageFa || t('success'),
        });
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
          disabled={registerMutation.isPending || healthMinistryLoading}
          dir="ltr"
        />

        <FloatingInput
          label={t('nationalId')}
          value={nationalId}
          onChangeText={setNationalId}
          type="number"
          error={errors.nationalId}
          disabled={registerMutation.isPending || healthMinistryLoading}
          maxLength={10}
          dir="ltr"
        />

        <View className="mb-4">
          <Button
            type="secondary"
            variant="solid"
            onPress={() => setShowDatePicker(true)}
            disabled={registerMutation.isPending || healthMinistryLoading}
            fullWidth
            className={errors.birthDate ? 'border-2 border-error' : ''}
          >
            {birthDate || t('birth')}
          </Button>
          {errors.birthDate && (
            <Text className="text-error text-xs mt-1 mx-1">
              {errors.birthDate}
            </Text>
          )}
        </View>

        <Button
          type="primary"
          size="large"
          onPress={handleRegister}
          loading={registerMutation.isPending}
          disabled={healthMinistryLoading}
          fullWidth
          className="mt-4"
        >
          {t('registering')}
        </Button>

        <View className="my-6 border-b border-gray-300 relative">
          <View className={`absolute -top-3 self-center px-2 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('registeringOtherWays')}
            </Text>
          </View>
        </View>

        <Button
          type="primary"
          variant="outline"
          size="large"
          onPress={healthMinistryLogin}
          loading={healthMinistryLoading}
          disabled={registerMutation.isPending}
          fullWidth
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
      >
        <DatePickerJalali
          selectedDate={birthDate}
          onDateChange={(date) => {
            setBirthDate(date);
            setShowDatePicker(false);
          }}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}
