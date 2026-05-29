import { useEffect } from 'react';
import { Stack } from 'expo-router';
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
import { colors } from '@/config/theme/colors';

SplashScreen.preventAutoHideAsync();

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
      <QueryProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
          }}
        />
      </QueryProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
