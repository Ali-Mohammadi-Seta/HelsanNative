import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BackHeader, Button, Modal, OtpInput } from '@/components';
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
import { shadows, useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';
import { formatCountdown } from '@/lib/format/digits';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerificationScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
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
  const toastLanguage = direction.isRTL ? 'fa' : 'en';

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

    showToast({ type: 'success', message: data, fallback: t('success'), language: toastLanguage });

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
        showToast({ type: 'success', message: t('success'), fallback: t('success'), language: toastLanguage });
      },
      onError: (error: any) => {
        showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
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
        showToast({ type: 'error', message: error, fallback: t('error'), language: toastLanguage });
        setCode('');
      },
    });
  };

  const handleOtpChange = (text: string) => {
    setCode(text);
    if (text.length === 6) onVerifyCode(text);
  };
  const remainingTime = formatCountdown(expiration, toastLanguage);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackHeader title={t('verifyCode')} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 18, paddingTop: 24, paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            shadows.lg,
            {
              borderRadius: 26,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              backgroundColor: isDark ? colors.glass : 'rgba(255,255,255,0.76)',
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['rgba(34,197,94,0.14)', 'rgba(20,184,166,0.06)'] : ['#ecfdf5', '#ffffff']}
            style={{ padding: 20 }}
          >
            <View style={{ alignItems: 'center' }}>
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
                <Ionicons name="shield-checkmark-outline" size={30} color={colors.primary} />
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
                  color: colors.textSecondary,
                  fontFamily: 'IRANSans',
                  fontSize: 13,
                  lineHeight: 22,
                  marginTop: 8,
                  textAlign: 'center',
                  writingDirection: direction.dir,
                }}
              >
                {t('resetText2')}{' '}
                <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', writingDirection: 'ltr' }}>
                  {phone}
                </Text>{' '}
                {t('resetText3')}
              </Text>
            </View>

            <OtpInput length={6} value={code} onChangeText={handleOtpChange} disabled={isLoading} autoFocus dir="ltr" />

            <Button
              type="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={code.length !== 6}
              onPress={() => code.length === 6 && onVerifyCode(code)}
            >
              {t('verifyCode')}
            </Button>

            {expiration !== 0 ? (
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                  gap: 7,
                  marginTop: 16,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(22,163,74,0.08)',
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
              <TouchableOpacity
                onPress={resendCode}
                disabled={loginMutation.isPending || registerMutation.isPending}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                  gap: 7,
                  marginTop: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                }}
              >
                <Ionicons name="refresh" size={19} color={colors.primary} />
                <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', fontSize: 13, writingDirection: direction.dir }}>
                  {t('sendAgain')}
                </Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </ScrollView>

      <Modal open={showChooseRoleModal} closable={false} size="md" centered>
        <ChooseCurrentRole setShowChooseRoleModal={setShowChooseRoleModal} />
      </Modal>
    </View>
  );
}
