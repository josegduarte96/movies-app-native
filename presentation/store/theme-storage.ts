import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'theme-mode';

export type ThemeMode = 'light' | 'dark' | 'system';

const isThemeMode = (v: string | null): v is ThemeMode =>
  v === 'light' || v === 'dark' || v === 'system';

// Lee el modo guardado; null si no hay (entonces se usa 'system' por defecto).
export const getStoredTheme = async (): Promise<ThemeMode | null> => {
  try {
    const value = await AsyncStorage.getItem(THEME_KEY);
    return isThemeMode(value) ? value : null;
  } catch {
    return null;
  }
};

export const setStoredTheme = (mode: ThemeMode): Promise<void> =>
  AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
