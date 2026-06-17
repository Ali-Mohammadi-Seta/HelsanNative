import Toast from 'react-native-toast-message';
import { resolveApiMessage } from '@/lib/api/resolveApiMessage';

type AppToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = ({
  type,
  message,
  fallback,
  language = 'fa',
}: {
  type: AppToastType;
  message?: unknown;
  fallback: string;
  language?: 'fa' | 'en';
}) => {
  Toast.show({
    type,
    text1: resolveApiMessage(message, fallback, language),
  });
};
