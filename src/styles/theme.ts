import { useAppSelector } from '@/redux/hooks';

export const lightColors = {
  primary: '#16a34a',
  secondary: '#0ea5a6',
  background: '#FFFFFF',
  card: '#F5F7F9',
  text: '#0b0b0b',
  textSecondary: '#4b5563',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#16a34a',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const darkColors = {
  primary: '#22c55e',
  secondary: '#14b8a6',
  background: '#0b0f14',
  card: '#12171d',
  text: '#FAFAFA', // brighter
  textSecondary: '#CBD5E1',
  border: '#374151',
  error: '#F87171',
  success: '#22C55E',
  warning: '#FBBF24',
  info: '#60A5FA',
};

export const useTheme = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const isDark = themeMode === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    mode: themeMode,
  };
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'IRANSans',
    medium: 'IRANSans-Medium',
    bold: 'IRANSans-Bold',
    light: 'IRANSans-Light',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};