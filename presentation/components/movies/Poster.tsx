import type { GestureResponderEvent } from 'react-native';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Movie } from '@/core/entities/movie.entity';
import { useTheme } from '@/presentation/providers/theme-provider';

interface Props {
  movie: Movie;
  width: number;
  height: number;
  onPress?: (e: GestureResponderEvent) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Poster = ({ movie, width, height, onPress }: Props) => {
  const { colors } = useTheme();
  const hasPoster = movie.posterPath !== 'no-poster';

  const posterShadow = {
    shadowColor: colors.ink.DEFAULT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  } as const;

  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.04 }],
    shadowOpacity: 0.15 + progress.value * 0.15,
    shadowRadius: 12 + progress.value * 6,
    elevation: 6 + progress.value * 6,
  }));

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reducedMotion) progress.value = withTiming(1, { duration: 120 });
  };

  const onPressOut = () => {
    if (!reducedMotion)
      progress.value = withSpring(0, { damping: 14, stiffness: 220 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Póster de ${movie.title}`}
      style={[{ width, height, backgroundColor: colors.paper }, posterShadow, animatedStyle]}
      className="rounded-[13px]">
      <View className="flex-1 overflow-hidden rounded-[13px] border" style={{ borderColor: colors.line, backgroundColor: colors.line }}>
        {hasPoster ? (
          <Image
            source={{ uri: movie.posterPath }}
            recyclingKey={String(movie.id)}
            contentFit="contain"
            transition={300}
            cachePolicy="memory-disk"
            style={{ width: '100%', height: '100%' }}
          />
        ) : null}
      </View>
    </AnimatedPressable>
  );
};

export default Poster;
