import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '@/components';
import LoginScreen from '@/screens/Auth/LoginScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import ResetPasswordVerification from '@/components/Auth/ResetPasswordVerification';
import ResetPassword from '@/components/Auth/ResetPassword';

type AuthTab = 'login' | 'register';
type AuthFlow =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'resetPasswordVerification'
  | 'resetPassword';

export default function AuthScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ flow?: AuthFlow }>();

  const initialFlow: AuthFlow = useMemo(() => params.flow || 'login', [params.flow]) as AuthFlow;

  const [activeTab, setActiveTab] = useState<AuthTab>(initialFlow === 'register' ? 'register' : 'login');
  const [authFlow, setAuthFlow] = useState<AuthFlow>(initialFlow);

  const [phone, setPhone] = useState('');
  const [challenge, setChallenge] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const goBackLogic = () => {
    if (authFlow !== 'login' && authFlow !== 'register') {
      setAuthFlow('login');
      setActiveTab('login');
      return;
    }
    router.back();
  };

  const toForgot = () => setAuthFlow('forgotPassword');
  const onChallengeReceived = (ch: string, ph: string) => {
    setChallenge(ch);
    setPhone(ph);
    setAuthFlow('resetPasswordVerification');
  };
  const onOtpVerified = (code: string) => {
    setVerifyCode(code);
    setAuthFlow('resetPassword');
  };
  const onPasswordChanged = () => {
    setAuthFlow('login');
    setActiveTab('login');
  };

  const showTabs = authFlow === 'login' || authFlow === 'register';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.background : '#ffffff'
      }}
    >
      {/* Header */}
      <BackHeader
        title={
          authFlow === 'forgotPassword' ? t('forgotPassword')
          : authFlow === 'resetPasswordVerification' ? t('verifyCode')
          : authFlow === 'resetPassword' ? t('resetPassword')
          : t('account')
        }
        onBackPress={goBackLogic}
      />

      {/* Tabs (Login / Register) */}
      {showTabs && (
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: isDark ? colors.border : '#e5e5e5'
        }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                setActiveTab('login');
                setAuthFlow('login');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'login' ? colors.primary : 'transparent'
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: 'IRANSans-Bold',
                color: activeTab === 'login'
                  ? colors.primary
                  : (isDark ? '#999999' : '#666666')
              }}>
                {t('user.login')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('register');
                setAuthFlow('register');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'register' ? colors.primary : 'transparent'
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: 'IRANSans-Bold',
                color: activeTab === 'register'
                  ? colors.primary
                  : (isDark ? '#999999' : '#666666')
              }}>
                {t('Register')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        {authFlow === 'forgotPassword' && (
          <ForgotPassword onChallengeReceived={onChallengeReceived} />
        )}

        {authFlow === 'resetPasswordVerification' && (
          <ResetPasswordVerification
            phone={phone}
            onVerified={onOtpVerified}
            onPhoneEdit={() => setAuthFlow('forgotPassword')}
          />
        )}

        {authFlow === 'resetPassword' && (
          <ResetPassword
            challenge={challenge}
            verifyCode={verifyCode}
            phone={phone}
            onPasswordChanged={onPasswordChanged}
          />
        )}

        {authFlow === 'login' && (
          <View style={{ flex: 1 }}>
            <LoginScreen />
            <TouchableOpacity
              onPress={toForgot}
              style={{ paddingHorizontal: 20, paddingVertical: 12 }}
            >
              <Text style={{
                color: colors.primary,
                textAlign: 'center',
                fontFamily: 'IRANSans',
                fontSize: 14
              }}>
                {t('forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {authFlow === 'register' && <RegisterScreen />}
      </View>
    </View>
  );
}