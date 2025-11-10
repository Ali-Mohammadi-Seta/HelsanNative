import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// ✅ UPDATED IMPORTS - Import OtpInput and Modal from index, Auth component directly
import { OtpInput, Modal, BackHeader } from '@/components';
import ChooseCurrentRole from '@/components/Auth/ChooseCurrentRole'; // ✅ Direct import

import { useLogin } from '@/lib/hooks/auth/useLogin';
import { useRegister } from '@/lib/hooks/auth/useRegister';
import { useVerifyLogin } from '@/lib/hooks/auth/useVerifyLogin';
import { useVerifyRegister } from '@/lib/hooks/auth/useVerifyRegister';
import { checkAuthorizeApi } from '@/lib/api/apiService';
import { setIsLoggedIn, setUserRole } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
    if (expiration > 0) {
      const timer = setTimeout(() => setExpiration((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiration]);

  const resendCode = () => {
    const formValues = isLogin ? userLoginFormValues : userRegisterFormValues;
    const mutation = isLogin ? loginMutation : registerMutation;

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
    const mutation = isLogin ? verifyLoginMutation : verifyRegisterMutation;
    const payload = isLogin ? { otp: otpCode } : { otpValue: otpCode };

    mutation.mutate(payload as any, {
      onSuccess: async (data) => {
        // (hooks already set login + navigate, but we keep this for role modal UX)
        try {
          const authResult = await checkAuthorizeApi();
          dispatch(setIsLoggedIn(authResult?.isLogin || true));
          dispatch(setUserRole(authResult?.roles?.ourRoles || []));
          Toast.show({ type: 'success', text1: data?.messageFa || t('success') });

          const roles = authResult?.roles?.ourRoles || [];
          if (roles.length > 1) setShowChooseRoleModal(true);
        } catch {
          // hooks will have navigated to home anyway
        }
      },
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
          <TouchableOpacity onPress={resendCode} disabled={loginMutation.isPending || registerMutation.isPending} className="flex-row items-center justify-center mt-6">
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
