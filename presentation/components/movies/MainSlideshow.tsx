import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';
import { Movie } from '@/core/entities/movie.entity';
import MovieCard from './MovieCard';

interface Props {
  movies: Movie[];
  title?: string;
  loadNextMovies?: () => void;
}

const POSTER_RATIO = 1.5;
const CAPTION_HEIGHT = 100;

const pad = (n: number) => String(n).padStart(2, '0');

const MainSlideshow = ({ movies, title, loadNextMovies }: Props) => {
  const ref = useRef<ICarouselInstance>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [active, setActive] = useState(0);
  const router = useRouter();

  const progress = useSharedValue(0);
  const hasTriggered = useRef(false);
  const prevLength = useRef(movies.length);

  useEffect(() => {
    if (movies.length > prevLength.current) {
      hasTriggered.current = false;
    }
    prevLength.current = movies.length;
  }, [movies.length]);

  const handleIndexChange = useCallback(
    (index: number) => {
      setActive(index);
      if (hasTriggered.current) return;
      if (index < movies.length - 4) return;
      hasTriggered.current = true;
      loadNextMovies?.();
    },
    [movies.length, loadNextMovies],
  );

  useAnimatedReaction(
    () => {
      const len = movies.length;
      if (len === 0) return 0;
      const rounded = Math.round(progress.value);
      return ((rounded % len) + len) % len;
    },
    (current, previous) => {
      if (current === previous) return;
      scheduleOnRN(handleIndexChange, current);
    },
    [movies.length, handleIndexChange],
  );

  const itemWidth = Math.round(screenWidth * 0.46);
  const cardWidth = itemWidth - 16;
  const cardHeight = Math.round(cardWidth * POSTER_RATIO);

  if (movies.length === 0) {
    return (
      <View
        style={{ height: cardHeight + 96 }}
        className="items-center justify-center px-10">
        <Text className="font-editorial text-xs uppercase tracking-[3px] text-accent">
          {title}
        </Text>
        <Text className="mt-3 text-center font-display text-xl text-ink">
          No hay estrenos ahora mismo
        </Text>
        <Text className="mt-1 text-center font-editorial text-sm text-ink-soft">
          Vuelve más tarde para ver la nueva cartelera.
        </Text>
      </View>
    );
  }

  return (
    <View className="py-4">
      <Animated.View
        entering={FadeInDown.duration(300)}
        className="flex-row items-baseline justify-between px-6">
        <Text className="font-editorial uppercase tracking-[3px] text-accent">
          {title}
        </Text>
        <Text
          style={{ fontVariant: ['tabular-nums'] }}
          className="font-editorial text-base text-ink-soft">
          {pad(active + 1)} / {pad(movies.length)}
        </Text>
      </Animated.View>

      <View className="mx-6 mt-3 h-px bg-line" />

      <Animated.View
        entering={FadeIn.duration(600).delay(120)}
        className="mt-4">
        <Carousel
          ref={ref}
          data={movies}
          width={itemWidth}
          height={cardHeight + CAPTION_HEIGHT}
          style={{ width: screenWidth }}
          pagingEnabled={false}
          snapEnabled={false}
          loop={movies.length > 1}
          scrollAnimationDuration={700}
          onConfigurePanGesture={(gesture) => {
            'worklet';
            gesture.activeOffsetX([-10, 10]);
            gesture.failOffsetY([-10, 10]);
          }}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              width={cardWidth}
              posterRatio={POSTER_RATIO}
              onPress={() => router.push(`/movie/${item.id}` as any)}
            />
          )}
        />
      </Animated.View>
    </View>
  );
};

export default MainSlideshow;
