import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextStyle, ViewStyle } from 'react-native';

export type AppDirection = 'rtl' | 'ltr';

export const getDirectionFromLanguage = (language?: string): AppDirection =>
  language?.startsWith('fa') ? 'rtl' : 'ltr';

export const useDirection = () => {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const dir = getDirectionFromLanguage(i18n.language);
    const isRTL = dir === 'rtl';
    const textAlign: TextStyle['textAlign'] = isRTL ? 'right' : 'left';
    const oppositeTextAlign: TextStyle['textAlign'] = isRTL ? 'left' : 'right';

    return {
      dir,
      isRTL,
      textAlign,
      oppositeTextAlign,
      text: {
        textAlign,
        writingDirection: dir,
      } satisfies TextStyle,
      centeredText: {
        textAlign: 'center',
        writingDirection: dir,
      } satisfies TextStyle,
      row: {
        flexDirection: isRTL ? 'row-reverse' : 'row',
      } satisfies ViewStyle,
      rowReverse: {
        flexDirection: isRTL ? 'row' : 'row-reverse',
      } satisfies ViewStyle,
      startItems: {
        alignItems: isRTL ? 'flex-end' : 'flex-start',
      } satisfies ViewStyle,
      endItems: {
        alignItems: isRTL ? 'flex-start' : 'flex-end',
      } satisfies ViewStyle,
    };
  }, [i18n.language]);
};
