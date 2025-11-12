import { useAppSelector } from '@/redux/hooks';

export const lightColors = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  secondary: '#0ea5a6',
  background: '#ffffff',
  surface: '#f8faf8', // Slightly green-tinted surface
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',
  border: '#d1d5db',
  divider: '#e5e7eb',
  error: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#3b82f6',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkColors = {
  primary: '#22c55e',
  primaryDark: '#16a34a',
  secondary: '#14b8a6',
  background: '#30473c', // Dark green-tinted background instead of pure black
  surface: '#1a1f1c', // Slightly lighter surface
  card: '#1f2623', // Card background in dark mode
  text: '#f0f4f1', // Light green-tinted text
  textSecondary: '#a7b3aa',
  textTertiary: '#7a857d',
  border: '#2d3831',
  divider: '#263029',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#fbbf24',
  info: '#60a5fa',
  overlay: 'rgba(0, 0, 0, 0.7)',
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