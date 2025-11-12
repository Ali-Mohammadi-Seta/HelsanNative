import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';
import { useAppSelector } from '@/redux/hooks';

// Define theme values
const themes = {
  light: vars({
    '--color-background': '255 255 255',
    '--color-surface': '248 250 248',
    '--color-card': '255 255 255',
    '--color-foreground': '26 26 26',
    '--color-foreground-secondary': '75 85 99',
    '--color-foreground-tertiary': '107 114 128',
    '--color-border': '209 213 219',
    '--color-divider': '229 231 235',
  }),
  dark: vars({
    '--color-background': '15 21 18',
    '--color-surface': '26 31 28',
    '--color-card': '31 38 35',
    '--color-foreground': '240 244 241',
    '--color-foreground-secondary': '167 179 170',
    '--color-foreground-tertiary': '122 133 125',
    '--color-border': '45 56 49',
    '--color-divider': '38 48 41',
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