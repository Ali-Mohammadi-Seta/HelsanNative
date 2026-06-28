import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as ExpoLinking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { BackHeader, SkeletonBox } from '@/components';
import config from '@/config';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { getAccessToken, getRefreshToken } from '@/lib/auth/tokenStorage';
import { submitSsoCode, applyAuthResponse } from '@/lib/auth/sso';
import { showToast } from '@/lib/toast/showToast';
import type { AppDispatch } from '@/redux/store';

const getHostName = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const shouldOpenOutsideWebView = (url: string): boolean => {
  try {
    const protocol = new URL(url).protocol;
    return !['http:', 'https:', 'about:', 'data:', 'blob:'].includes(protocol);
  } catch {
    return false;
  }
};

const openOutsideWebView = async (url: string): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // The WebView should stay usable even if the OS cannot handle a custom URL scheme.
    }
  }
};

// Origin of the SSO login host (dev: http://192.168.1.69:3000, prod: https://sso.inhso.ir).
// Used to detect when the consultation app gives up and bounces to SSO so we can break the loop.
const ssoOrigin = (() => {
  try {
    return new URL(config.sepehrSalamatSsoUrl).origin;
  } catch {
    return '';
  }
})();

// A navigation that means "the consultation app decided we are NOT authenticated".
// Note: /LoginFromSso (consultation's own role-selection page reached with ?authenticated=1)
// is intentionally NOT matched here — only the SSO *start* / external SSO provider is.
const isSsoStartNavigation = (url: string): boolean => {
  if (!url) return false;
  if (url.includes('/user/sso/start')) return true;
  if (url.includes('sso.inhso.ir')) return true;
  if (ssoOrigin && url.startsWith(ssoOrigin)) return true;
  return false;
};

const firstParam = (value: unknown): string => {
  if (Array.isArray(value)) return value[0] == null ? '' : String(value[0]);
  return value == null ? '' : String(value);
};

const makeNativeBridgeScript = `
(function () {
  window.__SALAM_NATIVE_WEBVIEW__ = true;
  window.open = function (url, target, features) {
    if (url && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'OPEN_URL',
        url: new URL(String(url), window.location.href).toString(),
        target: target || '_blank',
        features: features || ''
      }));
      return null;
    }
    return null;
  };
  document.addEventListener('click', function (event) {
    var node = event.target;
    var element = node && node.nodeType === 1 ? node : node && node.parentElement;
    var anchor = element && element.closest ? element.closest('a[href]') : null;
    if (!anchor || !window.ReactNativeWebView) return;
    if (anchor.getAttribute('aria-disabled') === 'true' || anchor.hasAttribute('disabled')) return;
    var href = anchor.getAttribute('href');
    if (!href || href.indexOf('#') === 0) return;
    var url = new URL(href, window.location.href).toString();
    var bridged = anchor.target === '_blank' ||
      anchor.hasAttribute('download') ||
      url.indexOf('tel:') === 0 ||
      url.indexOf('mailto:') === 0 ||
      url.indexOf('blob:') === 0;
    if (!bridged) return;
    event.preventDefault();
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: anchor.hasAttribute('download') || url.indexOf('blob:') === 0 ? 'DOWNLOAD_URL' : 'OPEN_URL',
      url: url,
      target: anchor.target || '',
      filename: anchor.getAttribute('download') || ''
    }));
  }, true);
})(); true;
`;

// Seed the native session into the WebView's localStorage BEFORE any consultation JS runs,
// so the consultation app's axios interceptor sends the Bearer token on its very first request.
const buildSeedScript = (access: string, refresh: string): string => `
  try {
    window.localStorage.setItem('inhs_access_token', ${JSON.stringify(access)});
    window.localStorage.setItem('inhs_refresh_token', ${JSON.stringify(refresh)});
    window.localStorage.setItem('access_token', ${JSON.stringify(access)});
  } catch (e) {}
  ${makeNativeBridgeScript}
`;

type ConsultationBridgeMessage = {
  type?: string;
  url?: string;
  external?: boolean;
};

type Phase = 'checking' | 'login' | 'ready';

export default function DoctorsConsultationScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ url?: string }>();
  const overrideUrl = typeof params.url === 'string' ? params.url.trim() : '';

  const webViewRef = useRef<WebViewType>(null);

  const [phase, setPhase] = useState<Phase>('checking');
  const [bridgeScript, setBridgeScript] = useState(makeNativeBridgeScript);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  const [showSsoModal, setShowSsoModal] = useState(false);
  const [ssoSubmitting, setSsoSubmitting] = useState(false);
  // Set when the consultation app rejected the seeded token and bounced to SSO (diagnostic).
  const [ssoBounceUrl, setSsoBounceUrl] = useState('');

  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Build the consultation entry URL. We go through /launch so the consultation app runs
  // GET /user, flips its Redux isLoggedIn to true, and routes by role — but with the token
  // already handed off via query params (read by Launch.tsx) so that check succeeds.
  const buildLaunchUrl = (access: string, refresh: string): string => {
    if (overrideUrl) return overrideUrl;
    try {
      const url = new URL(config.consultationLaunchUrl);
      url.searchParams.set('nativeToken', access);
      if (refresh) url.searchParams.set('nativeRefreshToken', refresh);
      url.searchParams.set('returnTo', '/');
      return url.toString();
    } catch {
      return config.consultationLaunchUrl;
    }
  };

  const enterConsultation = (access: string, refresh: string) => {
    const url = buildLaunchUrl(access, refresh);
    setBridgeScript(buildSeedScript(access, refresh));
    setWebViewUrl(url);
    setCurrentUrl(url);
    setSsoBounceUrl('');
    setHasError(false);
    setPhase('ready');
  };

  // Native holds the Bearer token; consultation auth works only by seeding that token into the
  // WebView's localStorage (cookies can't survive the http proxy). We do NOT call the native
  // /user API here on purpose: on a 401 the shared apiClient force-navigates to /(auth), which
  // is exactly what bounced the user back to the native app. We seed whatever token we have and
  // let the consultation app validate it.
  const prepare = async () => {
    setPhase('checking');
    const access = await getAccessToken();
    if (!access) {
      setPhase('login');
      return;
    }
    const refresh = (await getRefreshToken()) || '';
    enterConsultation(access, refresh);
  };

  useEffect(() => {
    void prepare();
    // Run once on mount; overrideUrl is captured from the initial params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the consultation app bounces to its own SSO, the seeded token was rejected by the
  // backend (retrying with the same token can't help). Surface the failing URL and fall back to
  // the explicit login screen so the user can get a fresh token — and so we can see the bounce.
  const handleSsoInterception = (attemptedUrl: string) => {
    if (__DEV__) console.log('🔁 [consult] SSO bounce — seeded token rejected →', attemptedUrl);
    setSsoBounceUrl(attemptedUrl);
    setPhase('login');
  };

  // Inline SSO login (same proven flow as the main auth screen). Keeps the user in context:
  // after login we seed the session and drop straight into the consultation WebView.
  const handleSsoModalNavigation = async (navState: WebViewNavigation) => {
    const url = navState?.url || '';
    if (!(url.includes('LoginFromSso') || url.includes('/sso/callback'))) return;

    setShowSsoModal(false);
    setSsoSubmitting(true);
    try {
      const parsed = ExpoLinking.parse(url);
      const code = firstParam(parsed.queryParams?.code);
      const error = firstParam(parsed.queryParams?.error);
      const state = firstParam(parsed.queryParams?.state);

      if (!code && !error) {
        showToast({ type: 'error', message: 'Authorization code missing', fallback: 'Error', language: 'en' });
        setPhase('login');
        return;
      }

      const data = await submitSsoCode(code, state, error);
      await applyAuthResponse(data, dispatch);

      const access = await getAccessToken();
      const refresh = await getRefreshToken();
      if (access) {
        enterConsultation(access, refresh || '');
      } else {
        setPhase('login');
      }
    } catch (err: unknown) {
      showToast({ type: 'error', message: err as string, fallback: 'Error', language: 'fa' });
      setPhase('login');
    } finally {
      setSsoSubmitting(false);
    }
  };

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCurrentUrl(navState.url);
  };

  const openExternal = async () => {
    await WebBrowser.openBrowserAsync(currentUrl);
  };

  const openInWebView = (url: string) => {
    setHasError(false);
    setWebViewUrl(url);
    setCurrentUrl(url);
  };

  const reload = () => {
    setHasError(false);
    webViewRef.current?.reload();
  };

  const goBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleBridgeMessage = async (event: WebViewMessageEvent) => {
    let message: ConsultationBridgeMessage | null = null;

    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (!message?.type || !message.url) return;

    if (shouldOpenOutsideWebView(message.url) || message.external) {
      await openOutsideWebView(message.url);
      return;
    }

    if (message.type === 'DOWNLOAD_URL') {
      await WebBrowser.openBrowserAsync(message.url);
      return;
    }

    if (message.type === 'OPEN_URL') {
      openInWebView(message.url);
    }
  };

  const handleOpenWindow = (event: { nativeEvent?: { targetUrl?: string } }) => {
    const url = event.nativeEvent?.targetUrl;
    if (url) openInWebView(url);
  };

  const renderSsoModal = () => (
    <Modal visible={showSsoModal} animationType="slide" onRequestClose={() => setShowSsoModal(false)}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            height: 50,
            backgroundColor: colors.surface,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginTop: 40,
          }}
        >
          <Pressable onPress={() => setShowSsoModal(false)} style={{ padding: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'IRANSans-Bold',
              color: colors.text,
              fontSize: 16,
              marginRight: 40,
            }}
          >
            ورود به سیستم
          </Text>
        </View>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: config.sepehrSalamatSsoUrl }}
          onNavigationStateChange={handleSsoModalNavigation}
          incognito
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }}
            />
          )}
        />
      </View>
    </Modal>
  );

  if (phase === 'checking' || ssoSubmitting) {
    return (
      <View className="flex-1" style={{ backgroundColor: isDark ? colors.background : '#f8fafc' }}>
        <BackHeader title={t('doctorsAndCounselingPsychologist')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (phase === 'login') {
    return (
      <View className="flex-1" style={{ backgroundColor: isDark ? colors.background : '#f8fafc' }}>
        <BackHeader title={t('doctorsAndCounselingPsychologist')} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: isDark ? colors.surface : '#ffffff',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Ionicons name="videocam-outline" size={30} color={colors.primary} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'IRANSans-Bold',
                color: colors.text,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              ورود به مشاوره
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'IRANSans',
                color: colors.textSecondary,
                marginBottom: 28,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              برای دریافت مشاوره ابتدا باید وارد حساب کاربری خود شوید.
            </Text>

            <Pressable
              onPress={() => setShowSsoModal(true)}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                width: '100%',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: '#ffffff', fontFamily: 'IRANSans-Bold', fontSize: 16 }}>
                ورود / ثبت نام
              </Text>
            </Pressable>

            {__DEV__ && ssoBounceUrl ? (
              <Text
                selectable
                style={{
                  fontSize: 10,
                  fontFamily: 'IRANSans',
                  color: '#ef4444',
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                debug — token rejected, bounced to:{'\n'}{ssoBounceUrl}
              </Text>
            ) : null}
          </View>
        </View>
        {renderSsoModal()}
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? colors.background : '#f8fafc' }}>
      <BackHeader title={t('doctorsAndCounselingPsychologist')} />

      <View
        className="px-3 py-2 border-b"
        style={{
          borderBottomColor: isDark ? colors.border : '#e5e7eb',
          backgroundColor: isDark ? colors.card : '#ffffff',
        }}
      >
        <View className="items-center gap-2" style={direction.row}>
          <TouchableOpacity
            onPress={goBack}
            disabled={!canGoBack}
            className="w-10 h-10 items-center justify-center rounded-full"
            style={{ opacity: canGoBack ? 1 : 0.35 }}
          >
            <Ionicons name={direction.isRTL ? 'chevron-forward' : 'chevron-back'} size={22} color={colors.text} />
          </TouchableOpacity>

          <View
            className="flex-1 h-10 rounded-full px-3 flex-row items-center gap-2"
            style={{ backgroundColor: isDark ? colors.surface : '#f1f5f9' }}
          >
            <Ionicons name="lock-closed" size={15} color={colors.primary} />
            <Text
              numberOfLines={1}
              className="flex-1 text-xs"
              style={{
                color: isDark ? colors.textSecondary : '#475569',
                fontFamily: 'IRANSans-Medium',
                ...direction.text,
              }}
            >
              {getHostName(currentUrl)}
            </Text>
            {isLoading && <SkeletonBox width={16} height={16} radius={8} />}
          </View>

          <TouchableOpacity onPress={reload} className="w-10 h-10 items-center justify-center rounded-full">
            <Ionicons name="refresh" size={21} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={openExternal} className="w-10 h-10 items-center justify-center rounded-full">
            <Ionicons name="open-outline" size={21} color={colors.text} />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View className="h-0.5 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? colors.border : '#e5e7eb' }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.max(progress * 100, 8)}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
        )}
      </View>

      <View className="flex-1 overflow-hidden">
        {hasError ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#ef444420' }}>
              <Ionicons name="cloud-offline-outline" size={30} color="#ef4444" />
            </View>
            <Text
              className="text-base text-center mb-4"
              style={{ color: isDark ? colors.text : '#111827', fontFamily: 'IRANSans-Bold' }}
            >
              {t('generalMessages.error')}
            </Text>
            <TouchableOpacity
              onPress={reload}
              className="px-5 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white" style={{ fontFamily: 'IRANSans-Bold' }}>
                {t('return')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: webViewUrl }}
            originWhitelist={['*']}
            javaScriptEnabled
            javaScriptCanOpenWindowsAutomatically
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            geolocationEnabled
            allowFileAccess
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
            mixedContentMode="compatibility"
            allowsBackForwardNavigationGestures
            cacheEnabled
            setSupportMultipleWindows={false}
            startInLoadingState
            injectedJavaScriptBeforeContentLoaded={bridgeScript}
            onMessage={handleBridgeMessage}
            onOpenWindow={handleOpenWindow}
            onNavigationStateChange={onNavigationStateChange}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
            }}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            onFileDownload={({ nativeEvent }) => {
              WebBrowser.openBrowserAsync(nativeEvent.downloadUrl);
            }}
            onShouldStartLoadWithRequest={(request) => {
              if (__DEV__) console.log('🌐 [consult] nav →', request.url);
              if (shouldOpenOutsideWebView(request.url)) {
                void openOutsideWebView(request.url);
                return false;
              }
              if (isSsoStartNavigation(request.url)) {
                handleSsoInterception(request.url);
                return false;
              }
              return true;
            }}
            style={{ backgroundColor: isDark ? colors.background : '#ffffff' }}
          />
        )}
      </View>
    </View>
  );
}
