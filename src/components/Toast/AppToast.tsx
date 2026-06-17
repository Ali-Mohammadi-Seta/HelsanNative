import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { useDirection } from '@/lib/hooks/useDirection';
import { resolveApiMessage } from '@/lib/api/resolveApiMessage';
import { shadows, useTheme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastKind = 'success' | 'error' | 'info' | 'warning';

const toastIcon: Record<ToastKind, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

const toastColor: Record<ToastKind, string> = {
  success: '#16a34a',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
};

function ToastView({
  kind,
  text1,
  text2,
}: {
  kind: ToastKind;
  text1?: unknown;
  text2?: unknown;
}) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const title = resolveApiMessage(
    text1,
    kind === 'error'
      ? direction.isRTL ? 'خطا' : 'Error'
      : direction.isRTL ? 'انجام شد' : 'Done',
    direction.isRTL ? 'fa' : 'en',
  );
  const description = text2 ? resolveApiMessage(text2, '', direction.isRTL ? 'fa' : 'en') : '';

  return (
    <View
      style={[
        styles.toast,
        shadows.lg,
        {
          backgroundColor: isDark ? colors.cardElevated : '#ffffff',
          borderColor: isDark ? colors.border : '#e5e7eb',
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${toastColor[kind]}1f` }]}>
        <Ionicons name={toastIcon[kind]} size={22} color={toastColor[kind]} />
      </View>
      <View style={[styles.textWrap, direction.startItems]}>
        <Text
          style={[styles.title, { color: colors.text }, direction.text]}
          numberOfLines={3}
        >
          {title}
        </Text>
        {!!description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }, direction.text]}
            numberOfLines={3}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function AppToast() {
  const insets = useSafeAreaInsets();
  const config: ToastConfig = {
    success: (props) => <ToastView kind="success" text1={props.text1} text2={props.text2} />,
    error: (props) => <ToastView kind="error" text1={props.text1} text2={props.text2} />,
    info: (props) => <ToastView kind="info" text1={props.text1} text2={props.text2} />,
    warning: (props) => <ToastView kind="warning" text1={props.text1} text2={props.text2} />,
  };

  return <Toast config={config} topOffset={insets.top + 26} />;
}

const styles = StyleSheet.create({
  toast: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    marginHorizontal: 14,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '92%',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
    lineHeight: 21,
  },
  description: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 2,
  },
});
