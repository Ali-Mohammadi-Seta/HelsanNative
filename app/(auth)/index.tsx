import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
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
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: isDark ? colors.background : '#fff' }}>
      {/* Custom header (RTL/LTR aware) */}
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
        <View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => { setActiveTab('login'); setAuthFlow('login'); }}
              className="flex-1 items-center pb-3 border-b-2"
              style={{ borderBottomColor: activeTab === 'login' ? colors.primary : 'transparent' }}
            >
              <Text className={`text-base font-bold ${activeTab === 'login' ? 'text-primary' : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                {t('user.login')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setActiveTab('register'); setAuthFlow('register'); }}
              className="flex-1 items-center pb-3 border-b-2"
              style={{ borderBottomColor: activeTab === 'register' ? colors.primary : 'transparent' }}
            >
              <Text className={`text-base font-bold ${activeTab === 'register' ? 'text-primary' : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
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
            <TouchableOpacity onPress={toForgot} className="mt-4">
              <Text className="text-primary text-center">{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {authFlow === 'register' && <RegisterScreen />}
      </View>
    </View>
  );
}
