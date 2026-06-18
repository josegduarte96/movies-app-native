import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme as useRNColorScheme, View } from 'react-native';
import { colorScheme as nwColorScheme, vars } from 'nativewind';

import { lightColors, darkColors } from '@/config/theme/colors';
import {
  getStoredTheme,
  setStoredTheme,
  type ThemeMode,
} from '@/presentation/store/theme-storage';

type Palette = {
  paper: string;
  ink: { DEFAULT: string; soft: string };
  line: string;
  field: string;
  accent: { DEFAULT: string; soft: string };
};

interface ThemeContextValue {
  colors: Palette;
  isDark: boolean;
  mode: ThemeMode;
  cycleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: 'system',
  cycleTheme: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Ciclo del botón: system → light → dark → system.
const CYCLE: ThemeMode[] = ['system', 'light', 'dark'];

// '#RRGGBB' → 'R G B' para el patrón rgb(var(--x) / <alpha-value>) de Tailwind.
const hexToTriplet = (hex: string): string => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemScheme = useRNColorScheme();
  // 'system' = sigue al SO; 'light'/'dark' = override manual persistido.
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Hidrata el modo guardado al arrancar (sobrevive a reinicios de la app).
  useEffect(() => {
    getStoredTheme().then((stored) => {
      if (stored) setModeState(stored);
    });
  }, []);

  // Mantiene el color scheme interno de NativeWind alineado (para `dark:` y
  // useColorScheme); 'system' delega en la Appearance del dispositivo.
  useEffect(() => {
    nwColorScheme.set(mode);
  }, [mode]);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setStoredTheme(next);
  }, []);

  const cycleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length];
      setStoredTheme(next);
      return next;
    });
  }, []);

  // Inyecta los tripletes RGB como variables CSS para los tokens NativeWind
  // (bg-paper, text-ink, border-line…). Fuente única: config/theme/colors.js.
  const themeVars = useMemo(
    () =>
      vars({
        '--color-paper': hexToTriplet(colors.paper),
        '--color-ink': hexToTriplet(colors.ink.DEFAULT),
        '--color-ink-soft': hexToTriplet(colors.ink.soft),
        '--color-line': hexToTriplet(colors.line),
        '--color-accent': hexToTriplet(colors.accent.DEFAULT),
        '--color-accent-soft': hexToTriplet(colors.accent.soft),
      }),
    [colors],
  );

  const value = useMemo(
    () => ({ colors, isDark, mode, cycleTheme, setMode }),
    [colors, isDark, mode, cycleTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVars]}>{children}</View>
    </ThemeContext.Provider>
  );
};
