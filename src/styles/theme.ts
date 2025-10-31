import { useAppSelector } from '@/redux/hooks';

export const lightColors = {
  primary: '#16a34a',
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#DC2626',
  success: '#16a34a',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const darkColors = {
  primary: '#22c55e',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  error: '#EF4444',
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