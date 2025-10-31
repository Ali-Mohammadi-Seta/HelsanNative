// app/(auth)/verification.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { OtpInput, Modal, ChooseCurrentRole } from '@/components'; // ✅ CHANGED IMPORT
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
  const { t, i18n } = useTranslation();
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

  // Hooks
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
        Toast.show({
          type: 'error',
          text1: error.response?.data?.messageFa || t('error'),
        });
      },
    });
  };

  const onVerifyCode = (otpCode: string) => {
    const mutation = isLogin ? verifyLoginMutation : verifyRegisterMutation;
    const payload = isLogin ? { otp: otpCode } : { otpValue: otpCode };
    
    mutation.mutate(payload, {
      onSuccess: async (data) => {
        console.log('✅ [Verification] Success:', data);
        
        try {
          // Check authorization
          const authResult = await checkAuthorizeApi();
          
          dispatch(setIsLoggedIn(authResult?.isLogin || true));
          dispatch(setUserRole(authResult?.roles?.ourRoles || []));
          
          Toast.show({
            type: 'success',
            text1: data?.messageFa || t('success'),
          });

          // Show role selection if multiple roles
          const roles = authResult?.roles?.ourRoles || [];
          if (roles.length > 1) {
            setShowChooseRoleModal(true);
          } else {
            // Set default role if only one
            if (roles.length === 1) {
              await AsyncStorage.setItem('currentRole', roles[0]);
            }
            router.replace('/(tabs)/home');
          }
        } catch (error) {
          console.error('❌ [Verification] Auth check failed:', error);
          router.replace('/(tabs)/home');
        }
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error.response?.data?.messageFa || t('error'),
        });
        setCode('');
      },
    });
  };

  const handleOtpChange = (text: string) => {
    setCode(text);
    if (text.length === 6) {
      onVerifyCode(text);
    }
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className={`border-b ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-200'}`}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons
              name={i18n.language === 'fa' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color={isDark ? colors.text : '#000000'}
            />
          </TouchableOpacity>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {t('verifyCode')}
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Content */}
      <View className={`flex-1 p-5 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
        <Text className={`text-sm text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('resetText2')}
          <Text className="text-primary"> {phone} </Text>
          {t('resetText3')}
        </Text>

        <OtpInput
          length={6}
          value={code}
          onChangeText={handleOtpChange}
          disabled={isLoading}
          autoFocus
          dir="ltr"
        />

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

        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center justify-center mt-6">
          <Ionicons name="pencil" size={16} color={colors.primary} />
          <Text className="text-primary ml-2">{t('editNumberPhone')}</Text>
        </TouchableOpacity>
      </View>

      {/* Role Selection Modal */}
      <Modal
        open={showChooseRoleModal}
        closable={false}
        size="md"
        centered
      >
        <ChooseCurrentRole setShowChooseRoleModal={setShowChooseRoleModal} />
      </Modal>
    </View>
  );
}