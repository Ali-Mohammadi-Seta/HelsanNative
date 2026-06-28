import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/styles/theme';
import { BackHeader } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { startSsoAuth, submitSsoCode, applyAuthResponse, getSsoRedirectUrl } from '@/lib/auth/sso';
import type { AppDispatch } from '@/redux/store';
import { showToast } from '@/lib/toast/showToast';
import { WebView } from 'react-native-webview';
import config from '@/config';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLinking from 'expo-linking';

export default function AuthScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const dispatch = useDispatch<AppDispatch>();
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSsoLogin = () => {
    setShowWebView(true);
  };

  const handleWebViewNavigation = async (navState: any) => {
    const { url } = navState;
    if (url.includes('LoginFromSso') || url.includes('/sso/callback')) {
      setShowWebView(false);
      setLoading(true);
      try {
        const parsed = ExpoLinking.parse(url);
        const code = Array.isArray(parsed.queryParams?.code) ? String(parsed.queryParams.code[0]) : String(parsed.queryParams?.code || '');
        const error = Array.isArray(parsed.queryParams?.error) ? String(parsed.queryParams.error[0]) : String(parsed.queryParams?.error || '');
        const state = Array.isArray(parsed.queryParams?.state) ? String(parsed.queryParams.state[0]) : String(parsed.queryParams?.state || '');
        
        if (!code && !error) {
          showToast({ type: 'error', message: 'Authorization code missing', fallback: 'Error', language: 'en' });
          return;
        }

        const data = await submitSsoCode(code, state, error);
        await applyAuthResponse(data, dispatch);
        showToast({ type: 'success', message: data, fallback: 'Success', language: 'fa' });

        const redirectUrl = getSsoRedirectUrl(data);
        if (redirectUrl) {
          router.replace({ pathname: '/doctors-consultation', params: { url: redirectUrl } });
          return;
        }
        
        router.replace('/(tabs)/home');
      } catch (err: any) {
        showToast({ type: 'error', message: err, fallback: 'Error', language: 'fa' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title={t('account')} onBackPress={() => router.back()} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: isDark ? colors.surface : '#ffffff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
          borderWidth: 1,
          borderColor: colors.border
        }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'IRANSans-Bold',
            color: colors.text,
            marginBottom: 8,
            textAlign: 'center'
          }}>
            {t('accountLogin')}
          </Text>
          <Text style={{
            fontSize: 14,
            fontFamily: 'IRANSans',
            color: colors.textSecondary,
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 24
          }}>
            برای ورود به حساب کاربری خود یا ثبت نام، به صفحه ورود یکپارچه منتقل خواهید شد.
          </Text>

          <Pressable
            onPress={handleSsoLogin}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              width: '100%',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed || loading ? 0.8 : 1,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={{
                color: '#ffffff',
                fontFamily: 'IRANSans-Bold',
                fontSize: 16
              }}>
                ورود / ثبت نام با SSO
              </Text>
            )}
          </Pressable>
        </View>
      </View>
      <Modal visible={showWebView} animationType="slide" onRequestClose={() => setShowWebView(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ height: 50, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 40 }}>
            <Pressable onPress={() => setShowWebView(false)} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'IRANSans-Bold', color: colors.text, fontSize: 16, marginRight: 40 }}>
              ورود به سیستم
            </Text>
          </View>
          <WebView
            style={{ flex: 1 }}
            source={{ uri: config.sepehrSalamatSsoUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            incognito={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator size="large" color={colors.primary} style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }} />}
          />
        </View>
      </Modal>
    </View>
  );
}
