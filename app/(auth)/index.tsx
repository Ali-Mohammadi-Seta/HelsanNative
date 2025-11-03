// app/(auth)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '@/redux/store';
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
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ flow?: AuthFlow }>();

  const loginStep = useSelector((state: RootState) => state.auth.loginStep);

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [authFlow, setAuthFlow] = useState<AuthFlow>('login');
  const [phone, setPhone] = useState('');
  const [challenge, setChallenge] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    if (params.flow) {
      setAuthFlow(params.flow);
    }
  }, [params.flow]);

  const handleForgotPassword = () => {
    setAuthFlow('forgotPassword');
  };

  const handleChallengeReceived = (challenge: string, phone: string) => {
    setChallenge(challenge);
    setPhone(phone);
    setAuthFlow('resetPasswordVerification');
  };

  const handleOTPVerified = (code: string) => {
    setVerifyCode(code);
    setAuthFlow('resetPassword');
  };

  const handlePasswordChanged = () => {
    setAuthFlow('login');
    setActiveTab('login');
  };

  const handlePhoneEdit = () => {
    setAuthFlow('forgotPassword');
  };

  const renderContent = () => {
    switch (authFlow) {
      case 'forgotPassword':
        return <ForgotPassword onChallengeReceived={handleChallengeReceived} />;

      case 'resetPasswordVerification':
        return (
          <ResetPasswordVerification
            phone={phone}
            onVerified={handleOTPVerified}
            onPhoneEdit={handlePhoneEdit}
          />
        );

      case 'resetPassword':
        return (
          <ResetPassword
            challenge={challenge}
            verifyCode={verifyCode}
            phone={phone}
            onPasswordChanged={handlePasswordChanged}
          />
        );

      default:
        return activeTab === 'login' ? (
          <>
            <LoginScreen />
            <TouchableOpacity onPress={handleForgotPassword} className="mt-4">
              <Text className="text-primary text-center">
                {t('forgotPassword')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <RegisterScreen />
        );
    }
  };

  const showTabs = authFlow === 'login' || authFlow === 'register';

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className={`border-b ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-200'}`}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => {
              if (authFlow !== 'login' && authFlow !== 'register') {
                setAuthFlow('login');
              } else {
                router.back();
              }
            }}
            className="p-2"
          >
            <Ionicons
              name={i18n.language === 'fa' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color={isDark ? colors.text : '#000000'}
            />
          </TouchableOpacity>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {authFlow === 'forgotPassword' && t('forgotPassword')}
            {authFlow === 'resetPasswordVerification' && t('verifyCode')}
            {authFlow === 'resetPassword' && t('resetPassword')}
            {(authFlow === 'login' || authFlow === 'register') && t('account')}
          </Text>
          <View className="w-10" />
        </View>

        {/* Tabs - Only show for login/register */}
        {showTabs && (
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => {
                setActiveTab('login');
                setAuthFlow('login');
              }}
              className="flex-1 items-center pb-3 border-b-2"
              style={{
                borderBottomColor: activeTab === 'login' ? colors.primary : 'transparent',
              }}
            >
              <Text
                className={`text-base font-bold ${
                  activeTab === 'login'
                    ? 'text-primary'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {t('user.login')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('register');
                setAuthFlow('register');
              }}
              className="flex-1 items-center pb-3 border-b-2"
              style={{
                borderBottomColor: activeTab === 'register' ? colors.primary : 'transparent',
              }}
            >
              <Text
                className={`text-base font-bold ${
                  activeTab === 'register'
                    ? 'text-primary'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {t('Register')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
}