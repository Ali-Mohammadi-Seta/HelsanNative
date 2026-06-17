import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, LayoutChangeEvent, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { shadows, useTheme } from '@/styles/theme';
import { BackHeader } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import LoginScreen from '@/screens/Auth/LoginScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import ResetPasswordVerification from '@/components/Auth/ResetPasswordVerification';
import ResetPassword from '@/components/Auth/ResetPassword';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type AuthTab = 'login' | 'register';
type AuthFlow =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'resetPasswordVerification'
  | 'resetPassword';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [tabWidth, setTabWidth] = useState(0);

  const indicatorLeft = useSharedValue(0);
  const loginScale = useSharedValue(1);
  const registerScale = useSharedValue(1);

  const tabs: { key: AuthTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = direction.isRTL
    ? [
        { key: 'register', label: t('Register'), icon: 'person-add-outline' },
        { key: 'login', label: t('user.login'), icon: 'log-in-outline' },
      ]
    : [
        { key: 'login', label: t('user.login'), icon: 'log-in-outline' },
        { key: 'register', label: t('Register'), icon: 'person-add-outline' },
      ];

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTabWidth(e.nativeEvent.layout.width / 2);
  }, []);

  useEffect(() => {
    const isFirst = direction.isRTL
      ? activeTab === 'register'
      : activeTab === 'login';
    indicatorLeft.value = withTiming(isFirst ? 4 : tabWidth, { duration: 220 });
  }, [activeTab, tabWidth, direction.isRTL, indicatorLeft]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
    width: tabWidth - 8,
  }));
  const loginStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loginScale.value }],
  }));
  const registerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: registerScale.value }],
  }));

  return (
    <View
      onLayout={handleLayout}
      style={{
        flexDirection: 'row',
        backgroundColor: isDark ? colors.surface : '#edf7f1',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 2,
        borderRadius: 18,
        padding: 4,
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Animated.View
        style={[
          indicatorStyle,
          {
            position: 'absolute',
            top: 4,
            bottom: 4,
            borderRadius: 14,
            overflow: 'hidden',
          },
        ]}
      >
        <LinearGradient
          colors={isDark ? ['#162019', '#1a2a22'] : ['#ffffff', '#f8fffb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {tabs.map((tab) => {
        const scale = tab.key === 'login' ? loginScale : registerScale;
        return (
          <AnimatedPressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            onPressIn={() => {
              scale.value = withTiming(0.98, { duration: 120 });
            }}
            onPressOut={() => {
              scale.value = withTiming(1, { duration: 160 });
            }}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                gap: 7,
                paddingVertical: 12,
                zIndex: 1,
              },
              tab.key === 'login' ? loginStyle : registerStyle,
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={17}
              color={activeTab === tab.key ? colors.primary : colors.textTertiary}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'IRANSans-Bold',
                color: activeTab === tab.key ? colors.primary : colors.textTertiary,
                writingDirection: direction.dir,
              }}
            >
              {tab.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

export default function AuthScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
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

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setAuthFlow(tab);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
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

      {/* Animated Pill Tab Bar */}
      {showTabs && (
        <View style={[shadows.sm, { backgroundColor: colors.background, paddingBottom: 8 }]}>
          <AnimatedTabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
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
            <Pressable
              onPress={toForgot}
              style={{ paddingHorizontal: 20, paddingVertical: 14 }}
            >
              <Text style={{
                color: colors.primary,
                textAlign: 'center',
                fontFamily: 'IRANSans',
                fontSize: 14,
                writingDirection: direction.dir,
              }}>
                {t('forgotPassword')}
              </Text>
            </Pressable>
          </View>
        )}

        {authFlow === 'register' && <RegisterScreen />}
      </View>
    </View>
  );
}
