import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { type PropsWithChildren } from 'react';

import { lightColors, darkColors } from '@/config/theme/colors';
import {
  getStoredTheme,
  setStoredTheme,
} from '@/presentation/store/theme-storage';

type Palette = {
  paper: string;
  ink: { DEFAULT: string; soft: string };
  line: string;
  accent: { DEFAULT: string; soft: string };
};

type Override = 'light' | 'dark' | null;

interface ThemeContextValue {
  colors: Palette;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  // null = sigue al sistema; al togglear se fija un override manual persistido.
  const [override, setOverride] = useState<Override>(null);

  // Hidrata el modo guardado al arrancar (sobrevive a reinicios de la app).
  useEffect(() => {
    getStoredTheme().then((stored) => {
      if (stored) setOverride(stored);
    });
  }, []);

  const isDark = override ? override === 'dark' : colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setOverride((prev) => {
      const current = prev ? prev === 'dark' : colorScheme === 'dark';
      const next = current ? 'light' : 'dark';
      setStoredTheme(next);
      return next;
    });
  }, [colorScheme]);

  const value = useMemo(
    () => ({ colors, isDark, toggleTheme }),
    [colors, isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
