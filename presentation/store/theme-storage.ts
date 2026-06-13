import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'theme-mode';

export type ThemeMode = 'light' | 'dark';

// Lee el modo guardado; null si no hay (entonces se sigue al sistema).
export const getStoredTheme = async (): Promise<ThemeMode | null> => {
  try {
    const value = await AsyncStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

export const setStoredTheme = (mode: ThemeMode): Promise<void> =>
  AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
