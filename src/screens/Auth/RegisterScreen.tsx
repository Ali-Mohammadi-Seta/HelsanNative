// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-jalaali';
import { FloatingInput, Button } from '@/components';
import { useRegister } from '@/lib/hooks/auth/useRegister'; // ✅ USE HOOK
import { setUserRegisterFormValues } from '@/redux/slices/userSlice';
import { useTheme } from '@/styles/theme';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ 
    phone?: string; 
    nationalId?: string; 
    birthDate?: string;
  }>({});

  const registerMutation = useRegister(); // ✅ USE HOOK

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

  const convertToShamsi = (date: Date): string => {
    return moment(date).format('jYYYY/jMM/jDD');
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    const shamsiDate = convertToShamsi(birthDate!);
    const payload = {
      phone,
      nationalId,
      birthDate: shamsiDate,
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

  const healthMinistryLogin = () => {
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
          disabled={registerMutation.isPending}
          dir="ltr"
        />

        <FloatingInput
          label={t('nationalId')}
          value={nationalId}
          onChangeText={setNationalId}
          type="number"
          error={errors.nationalId}
          disabled={registerMutation.isPending}
        />

        <View className="mb-4">
          <Button
            type="secondary"
            variant="solid"
            onPress={() => setShowDatePicker(true)}
            fullWidth
            className={errors.birthDate ? 'border-2 border-error' : ''}
          >
            {birthDate ? convertToShamsi(birthDate) : t('birth')}
          </Button>
          {errors.birthDate && (
            <Text className="text-error text-xs mt-1 mx-1">
              {errors.birthDate}
            </Text>
          )}
        </View>

        <DatePicker
          modal
          open={showDatePicker}
          date={birthDate || new Date()}
          mode="date"
          onConfirm={(date: Date) => {
            setShowDatePicker(false);
            setBirthDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
          maximumDate={new Date()}
        />

        <Button
          type="primary"
          size="large"
          onPress={handleRegister}
          loading={registerMutation.isPending}
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
          variant="link"
          size="large"
          onPress={healthMinistryLogin}
          disabled={registerMutation.isPending}
          fullWidth
          className="border border-primary"
        >
          {t('healthMinistry')}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}