import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader, Modal, OtpInput } from '@/components';
import ChooseCurrentRole from '@/components/Auth/ChooseCurrentRole';
import { useLogin } from '@/lib/hooks/auth/useLogin';
import { useRegister } from '@/lib/hooks/auth/useRegister';
import { useVerifyLogin } from '@/lib/hooks/auth/useVerifyLogin';
import { useVerifyRegister } from '@/lib/hooks/auth/useVerifyRegister';
import {
  applyAuthResponse,
  clearPendingSsoRedirectUrl,
  getSsoRedirectUrl,
  getStoredCurrentRole,
  normalizeRoles,
  setPendingSsoRedirectUrl,
  setStoredCurrentRole,
} from '@/lib/auth/sso';
import { RootState, AppDispatch } from '@/redux/store';
import { useTheme } from '@/styles/theme';

export default function VerificationScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ type: 'login' | 'register' }>();
  const isLogin = params.type === 'login';

  const { userRegisterFormValues, userLoginFormValues } = useSelector((state: RootState) => state.user);
  const [code, setCode] = useState('');
  const [expiration, setExpiration] = useState(60);
  const [showChooseRoleModal, setShowChooseRoleModal] = useState(false);

  const phone = isLogin ? userLoginFormValues?.phone : userRegisterFormValues?.phone;

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyLoginMutation = useVerifyLogin();
  const verifyRegisterMutation = useVerifyRegister();

  const isLoading = verifyLoginMutation.isPending || verifyRegisterMutation.isPending;

  useEffect(() => {
    if (expiration <= 0) return;
    const timer = setTimeout(() => setExpiration((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [expiration]);

  const goToConsultation = (url: string) => {
    router.replace({ pathname: '/doctors-consultation', params: { url } });
  };

  const finishVerification = async (data: unknown) => {
    const redirectUrl = getSsoRedirectUrl(data);
    const authResult = await applyAuthResponse(data, dispatch);
    const roles = normalizeRoles(authResult?.roles?.ourRoles);

    Toast.show({ type: 'success', text1: (data as any)?.messageFa || t('success') });

    if (redirectUrl) {
      const currentRole = await getStoredCurrentRole();

      if (currentRole) {
        await clearPendingSsoRedirectUrl();
        goToConsultation(redirectUrl);
        return;
      }

      if (roles.length === 1) {
        await setStoredCurrentRole(roles[0]);
        await clearPendingSsoRedirectUrl();
        goToConsultation(redirectUrl);
        return;
      }

      if (roles.length > 1) {
        await setPendingSsoRedirectUrl(redirectUrl);
        setShowChooseRoleModal(true);
        return;
      }

      goToConsultation(redirectUrl);
      return;
    }

    await clearPendingSsoRedirectUrl();

    if (roles.length > 1) {
      setShowChooseRoleModal(true);
      return;
    }

    router.replace('/(tabs)/home');
  };

  const resendCode = () => {
    const formValues = isLogin ? userLoginFormValues : userRegisterFormValues;
    const mutation = isLogin ? loginMutation : registerMutation;

    if (!formValues) return;

    mutation.mutate(formValues as any, {
      onSuccess: () => {
        setExpiration(60);
        setCode('');
        Toast.show({ type: 'success', text1: t('success') });
      },
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error.response?.data?.messageFa || t('error') });
      },
    });
  };

  const onVerifyCode = (otpCode: string) => {
    if (isLoading) return;

    const mutation = isLogin ? verifyLoginMutation : verifyRegisterMutation;
    const payload = isLogin ? { otp: otpCode } : { otpValue: otpCode };

    mutation.mutate(payload as any, {
      onSuccess: finishVerification,
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error.response?.data?.messageFa || t('error') });
        setCode('');
      },
    });
  };

  const handleOtpChange = (text: string) => {
    setCode(text);
    if (text.length === 6) onVerifyCode(text);
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <BackHeader title={t('verifyCode')} />

      <View className={`flex-1 p-5 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
        <Text className={`text-sm text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('resetText2')}<Text className="text-primary"> {phone} </Text>{t('resetText3')}
        </Text>

        <OtpInput length={6} value={code} onChangeText={handleOtpChange} disabled={isLoading} autoFocus dir="ltr" />

        {expiration !== 0 ? (
          <Text className={`text-center mt-6 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('resetText')} <Text className="text-primary">{expiration}</Text> {t('second')}
          </Text>
        ) : (
          <TouchableOpacity
            onPress={resendCode}
            disabled={loginMutation.isPending || registerMutation.isPending}
            className="flex-row items-center justify-center mt-6"
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text className="text-primary font-bold ml-2">{t('sendAgain')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal open={showChooseRoleModal} closable={false} size="md" centered>
        <ChooseCurrentRole setShowChooseRoleModal={setShowChooseRoleModal} />
      </Modal>
    </View>
  );
}
