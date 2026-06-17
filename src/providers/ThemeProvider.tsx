import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';
import { useAppSelector } from '@/redux/hooks';

// Define theme values
const themes = {
  light: vars({
    '--color-background': '248 250 249',
    '--color-surface': '241 245 243',
    '--color-card': '255 255 255',
    '--color-foreground': '17 24 39',
    '--color-foreground-secondary': '75 85 99',
    '--color-foreground-tertiary': '156 163 175',
    '--color-border': '229 231 235',
    '--color-divider': '243 244 246',
  }),
  dark: vars({
    '--color-background': '12 20 16',
    '--color-surface': '17 26 21',
    '--color-card': '22 32 25',
    '--color-foreground': '240 253 244',
    '--color-foreground-secondary': '148 163 184',
    '--color-foreground-tertiary': '100 116 139',
    '--color-border': '30 58 46',
    '--color-divider': '23 43 33',
  }),
};

interface ThemeContextValue {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: false });

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Now this will work because it's inside the Redux Provider
  const mode = useAppSelector((s) => s.theme.mode);
  const isDark = mode === 'dark';

  // Make sure we have a valid theme mode
  const themeVars = themes[mode] || themes.light;

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <View style={[{ flex: 1 }, themeVars]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}