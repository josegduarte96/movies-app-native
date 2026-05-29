import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { type PropsWithChildren } from 'react';

import { lightColors, darkColors } from '@/config/theme/colors';

type Palette = {
  paper: string;
  ink: { DEFAULT: string; soft: string };
  line: string;
  accent: { DEFAULT: string; soft: string };
};

interface ThemeContextValue {
  colors: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(() => ({ colors, isDark }), [colors, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
