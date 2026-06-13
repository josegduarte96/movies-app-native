import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Movie } from '@/core/entities/movie.entity';
import { ThemedText } from '@/presentation/components/ui/ThemedText';

interface Props {
  movie: Movie;
  onOpen: () => void;
}

const THUMB_WIDTH = 60;
const THUMB_HEIGHT = Math.round(THUMB_WIDTH * 1.5);
// Spring "tight" del design system para filas (rápido, poco rebote).
const PRESS_SPRING = { damping: 20, stiffness: 400, mass: 0.5 };

/**
 * Fila de resultado de búsqueda separada por hairline (no es una tarjeta):
 * miniatura 60px, título serif, año en rojo suave y sinopsis a dos líneas.
 * Se hunde a 0.97 con un spring tight al pulsar. Plano salvo la miniatura.
 */
const ResultRow = ({ movie, onOpen }: Props) => {
  const reducedMotion = useReducedMotion();
  const year = movie.releaseDate.getFullYear();
  const hasPoster = movie.posterPath !== 'no-poster';

  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    if (!reducedMotion) scale.value = withSpring(0.97, PRESS_SPRING);
  };
  const onPressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
  };

  return (
    <Pressable
      onPress={onOpen}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}${Number.isNaN(year) ? '' : `, ${year}`}`}>
      <Animated.View
        style={pressStyle}
        className="flex-row border-b border-line px-6 py-3">
        <View
          style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
          className="overflow-hidden rounded-lg bg-line">
          {hasPoster ? (
            <Image
              source={{ uri: movie.posterPath }}
              style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : null}
        </View>
        <View className="ml-4 flex-1 pt-0.5">
          <ThemedText
            numberOfLines={2}
            style={{ fontSize: 18, lineHeight: 23 }}
            className="font-display">
            {movie.title}
          </ThemedText>
          {!Number.isNaN(year) ? (
            <ThemedText
              tone="accent-soft"
              style={{ fontSize: 14, fontVariant: ['tabular-nums'] }}
              className="mt-0.5 font-editorial">
              {year}
            </ThemedText>
          ) : null}
          {movie.overview ? (
            <ThemedText
              tone="soft"
              numberOfLines={2}
              style={{ fontSize: 14, lineHeight: 20 }}
              className="mt-1.5 font-editorial">
              {movie.overview}
            </ThemedText>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ResultRow;
