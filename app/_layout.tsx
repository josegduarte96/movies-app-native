import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_700Bold,
  useFonts,
} from '@expo-google-fonts/lora';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import '../global.css';
import { QueryProvider } from '@/presentation/providers/query-provider';
import { ThemeProvider, useTheme } from '@/presentation/providers/theme-provider';

SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const { colors, isDark } = useTheme();

  // Crossfade global al alternar tema: una capa con el nuevo `paper` cubre la
  // pantalla y se desvanece, revelando el contenido ya recoloreado. Se omite en
  // el primer render para no tapar la apertura de la portada.
  const fade = useSharedValue(0);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    fade.value = 1;
    fade.value = withTiming(0, { duration: 340 });
  }, [isDark, fade]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.paper, zIndex: 999 },
          overlayStyle,
        ]}
      />
    </>
  );
};

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Mantén el splash hasta que la tipografía editorial esté lista: evita el
  // flash de fuente del sistema (FOUT) en la masthead y el slideshow.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <QueryProvider>
          <AppContent />
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
