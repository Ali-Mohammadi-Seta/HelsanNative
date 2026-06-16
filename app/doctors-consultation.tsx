import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams } from 'expo-router';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { BackHeader } from '@/components';
import config from '@/config';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';

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

type ConsultationBridgeMessage = {
  type?: string;
  url?: string;
  external?: boolean;
};

export default function DoctorsConsultationScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const params = useLocalSearchParams<{ url?: string }>();
  const webViewRef = useRef<WebViewType>(null);

  const initialUrl = useMemo(() => {
    const url = typeof params.url === 'string' ? params.url.trim() : '';
    return url || config.consultationSsoUrl;
  }, [params.url]);

  const [webViewUrl, setWebViewUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

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

    if (
      shouldOpenOutsideWebView(message.url) ||
      message.external
    ) {
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
            {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
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
            injectedJavaScriptBeforeContentLoaded={makeNativeBridgeScript}
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
              if (shouldOpenOutsideWebView(request.url)) {
                void openOutsideWebView(request.url);
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
