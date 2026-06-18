import type { GestureResponderEvent } from 'react-native';
import { Platform, Pressable, View } from 'react-native';
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
import { DURATION, SHADOW, SPRING } from '@/presentation/constants/motion';

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

  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.04 }],
    shadowOpacity: 0.15 + progress.value * 0.15,
    shadowRadius: 12 + progress.value * 6,
    elevation: 6 + progress.value * 6,
  }));

  const onPressIn = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reducedMotion)
      progress.value = withTiming(1, { duration: DURATION.pressIn });
  };

  const onPressOut = () => {
    if (!reducedMotion) progress.value = withSpring(0, SPRING.poster);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Póster de ${movie.title}`}
      style={[
        { width, height, shadowColor: colors.ink.DEFAULT },
        SHADOW.poster,
        animatedStyle,
      ]}
      className="rounded-[13px] bg-paper">
      <View className="flex-1 overflow-hidden rounded-[13px] border border-line bg-line">
        {hasPoster ? (
          <Image
            source={{ uri: movie.posterPath }}
            recyclingKey={String(movie.id)}
            contentFit="contain"
            transition={DURATION.imageFade}
            cachePolicy="memory-disk"
            style={{ width: '100%', height: '100%' }}
          />
        ) : null}
      </View>
    </AnimatedPressable>
  );
};

export default Poster;
