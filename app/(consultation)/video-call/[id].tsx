import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { Ionicons } from '@expo/vector-icons';
import config from '@/consultation/api/config';

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  // According to plan, we pass the /calls/:id to the webview
  const callUrl = `${config.apiUrl.replace(/\/api.*$/, '')}/calls/${id}`;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : colors.background }}>
      <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : colors.card, zIndex: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 20 }}>
          <Ionicons name={direction.isRTL ? "arrow-forward" : "arrow-back"} size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 16, color: colors.text, marginHorizontal: 12 }}>
          تماس تصویری
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {isLoading && (
          <View style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ fontFamily: 'IRANSans-Medium', color: colors.text, marginTop: 16 }}>در حال اتصال به اتاق...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: callUrl }}
          originWhitelist={['*']}
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
          onLoadEnd={() => setIsLoading(false)}
          style={{ flex: 1, backgroundColor: 'transparent' }}
        />
      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';
