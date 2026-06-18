import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/presentation/providers/theme-provider';
import { DURATION, OPACITY } from '@/presentation/constants/motion';

/**
 * Caja skeleton con pulso de opacidad 0.45 ↔ 0.85 en bucle (800ms). El relleno
 * es hairline — nunca un spinner para contenido (regla del design system). Cada
 * caja corre su propio shared value; respeta reduce-motion (queda estática).
 * Usa el token `line` del tema, así que respeta el modo oscuro.
 */
export const SkeletonBox = ({ style }: { style?: ViewStyle }) => {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue<number>(OPACITY.skeletonMin);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withRepeat(
      withTiming(OPACITY.skeletonMax, { duration: DURATION.pulse }),
      -1,
      true,
    );
  }, [reducedMotion, opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[{ backgroundColor: colors.line }, style, pulse]} />
  );
};

const POSTER_WIDTH = 150;
const POSTER_HEIGHT = Math.round(POSTER_WIDTH * 1.5);

/** Tarjeta-póster skeleton: placa 150×225 + dos líneas de caption. */
export const SkeletonCard = () => (
  <View style={{ width: POSTER_WIDTH }}>
    <SkeletonBox
      style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT, borderRadius: 13 }}
    />
    <SkeletonBox
      style={{ height: 14, width: '80%', borderRadius: 4, marginTop: 12 }}
    />
    <SkeletonBox
      style={{ height: 11, width: '40%', borderRadius: 4, marginTop: 8 }}
    />
  </View>
);

/** Fila de resultado skeleton: miniatura 60×90 + tres líneas de texto. */
export const SkeletonRow = () => {
  const { colors } = useTheme();
  return (
  <View
    className="flex-row border-b px-6 py-3"
    style={{ borderColor: colors.line }}>
    <SkeletonBox style={{ width: 60, height: 90, borderRadius: 8 }} />
    <View className="ml-4 flex-1 pt-1">
      <SkeletonBox style={{ height: 16, width: '62%', borderRadius: 4 }} />
      <SkeletonBox
        style={{ height: 12, width: '26%', borderRadius: 4, marginTop: 10 }}
      />
      <SkeletonBox
        style={{ height: 11, width: '92%', borderRadius: 4, marginTop: 14 }}
      />
      <SkeletonBox
        style={{ height: 11, width: '78%', borderRadius: 4, marginTop: 7 }}
      />
    </View>
  </View>
  );
};
