import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { I18nManager, View } from 'react-native';
import { styled } from 'nativewind';
import { useTheme } from '@/styles/theme';

const Root = styled(View);

export default function RootLayout() {
  const { i18n } = useTranslation();
  const { mode } = useTheme(); // 'dark' | 'light'
  const isRTL = i18n.language === 'fa';

  // NOTE: If you need to really switch RN layout at runtime, do it during app bootstrap once:
  // if (I18nManager.isRTL !== isRTL) {
  //   I18nManager.allowRTL(isRTL);
  //   I18nManager.forceRTL(isRTL);
  // }

  return (
    <SafeAreaProvider>
      <Root
        className={mode === 'dark' ? 'dark' : ''}
        style={{
          flex: 1,
          direction: isRTL ? 'rtl' : 'ltr',
          writingDirection: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Slot />
      </Root>
    </SafeAreaProvider>
  );
}
