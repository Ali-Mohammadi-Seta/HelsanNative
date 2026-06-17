import { useAppSelector } from '@/redux/hooks';
import { Platform } from 'react-native';

export const lightColors = {
  // Core
  primary: '#16a34a',
  primaryDark: '#15803d',
  primaryLight: '#22c55e',
  primarySoft: '#dcfce7',
  secondary: '#0ea5a6',
  secondaryLight: '#14b8a6',
  secondarySoft: '#ccfbf1',
  accent: '#6366f1',
  accentSoft: '#e0e7ff',

  // Backgrounds
  background: '#f8faf9',
  surface: '#f1f5f3',
  card: '#ffffff',
  cardElevated: '#ffffff',

  // Text
  text: '#111827',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',

  // Borders & dividers
  border: '#e5e7eb',
  divider: '#f3f4f6',

  // Input
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  inputBorderFocused: '#16a34a',

  // Header
  headerBackground: '#ffffff',
  headerBorder: '#f3f4f6',

  // Tab bar
  tabBarBackground: '#ffffff',
  tabBarBorder: '#f3f4f6',

  // Glass
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',

  // Status
  error: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayDense: 'rgba(0, 0, 0, 0.6)',
};

export const darkColors = {
  // Core
  primary: '#22c55e',
  primaryDark: '#16a34a',
  primaryLight: '#4ade80',
  primarySoft: 'rgba(34, 197, 94, 0.12)',
  secondary: '#14b8a6',
  secondaryLight: '#2dd4bf',
  secondarySoft: 'rgba(20, 184, 166, 0.12)',
  accent: '#818cf8',
  accentSoft: 'rgba(129, 140, 248, 0.12)',

  // Backgrounds
  background: '#0c1410',
  surface: '#111a15',
  card: '#162019',
  cardElevated: '#1a2a22',

  // Text
  text: '#f0fdf4',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',

  // Borders & dividers
  border: '#1e3a2e',
  divider: '#172b21',

  // Input
  inputBackground: '#162019',
  inputBorder: '#1e3a2e',
  inputBorderFocused: '#22c55e',

  // Header
  headerBackground: '#111a15',
  headerBorder: '#1e3a2e',

  // Tab bar
  tabBarBackground: '#111a15',
  tabBarBorder: '#1e3a2e',

  // Glass
  glass: 'rgba(22, 32, 25, 0.82)',
  glassBorder: 'rgba(34, 197, 94, 0.08)',

  // Status
  error: '#ef4444',
  success: '#22c55e',
  warning: '#fbbf24',
  info: '#60a5fa',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayDense: 'rgba(0, 0, 0, 0.8)',
};

export type ThemeColors = typeof lightColors;

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
  xxs: 2,
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
    xxs: 10,
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  round: 999,
};

export const shadows = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
  }) as any,
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
  }) as any,
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
  }) as any,
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
    },
    android: { elevation: 10 },
  }) as any,
  colored: (color: string) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }) as any,
};

export const gradients = {
  primaryButton: ['#16a34a', '#22c55e'] as [string, string],
  primaryButtonDark: ['#15803d', '#16a34a'] as [string, string],
  heroBanner: {
    light: ['#ecfdf5', '#d1fae5', '#f0fdf4'] as [string, string, string],
    dark: ['#0a1f16', '#122b1e', '#0c1410'] as [string, string, string],
  },
  card: {
    light: ['#ffffff', '#f8faf9'] as [string, string],
    dark: ['#1a2a22', '#162019'] as [string, string],
  },
  warm: {
    light: ['#fff7ed', '#ffedd5'] as [string, string],
    dark: ['#1c1410', '#231a13'] as [string, string],
  },
  consultation: {
    light: ['#fef2f2', '#fecaca'] as [string, string],
    dark: ['#1f1214', '#2a1a1c'] as [string, string],
  },
};

export const animationDurations = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: { damping: 15, stiffness: 150 },
  springBouncy: { damping: 12, stiffness: 180 },
};