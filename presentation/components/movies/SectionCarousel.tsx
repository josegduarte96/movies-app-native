import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Movie } from '@/core/entities/movie.entity';
import { ThemedIcon } from '@/presentation/components/ui/ThemedIcon';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { ThemedView } from '@/presentation/components/ui/ThemedView';
import { pad2 } from '@/presentation/utils/format';
import { EYEBROW_LG } from '@/presentation/constants/typography';
import PosterCard from './PosterCard';

interface Props {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  movies: Movie[];
  order?: number;
  onOpen: (movie: Movie) => void;
  loadNext?: () => void;
}

const POSTER_WIDTH = 150;
const GAP = 16;
const SNAP = POSTER_WIDTH + GAP; // 166 — firma del scroll del carrusel
const GUTTER = 24;

const AnimatedMovieList = Animated.FlatList<Movie>;

/**
 * Sección de cartelera: cabecera editorial (etiqueta tracked roja + contador
 * tabular «01 / 12» sobre un hairline) y un riel horizontal con snap. El
 * contador sigue la tarjeta activa en el hilo de UI (scroll handler →
 * useAnimatedReaction → setActive), sin re-render por frame.
 */
const SectionCarousel = ({
  title,
  icon,
  movies,
  order = 0,
  onOpen,
  loadNext,
}: Props) => {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(1);
  const total = movies.length;

  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  useAnimatedReaction(
    () => {
      if (total === 0) return 1;
      const idx = Math.round(scrollX.value / SNAP) + 1;
      return Math.min(Math.max(idx, 1), total);
    },
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setActive, current);
    },
    [total],
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <PosterCard movie={item} width={POSTER_WIDTH} onPress={() => onOpen(item)} />
    ),
    [onOpen],
  );

  const entering = reducedMotion
    ? undefined
    : FadeIn.duration(600).delay(order * 120);

  return (
    <Animated.View entering={entering} className="mt-7">
      {/* Cabecera: etiqueta roja + contador tabular, ambos en la línea base. */}
      <View className="flex-row items-baseline justify-between px-6">
        <View className="flex-row items-center">
          {icon ? (
            <ThemedIcon
              tone="accent"
              name={icon}
              size={15}
              style={{ marginRight: 7 }}
            />
          ) : null}
          <ThemedText
            tone="accent"
            style={EYEBROW_LG}
            className="font-editorial uppercase">
            {title}
          </ThemedText>
        </View>
        <ThemedText
          tone="soft"
          style={{ fontSize: 15, fontVariant: ['tabular-nums'] }}
          className="pl-3 font-editorial">
          {pad2(active)} / {pad2(total)}
        </ThemedText>
      </View>
      <ThemedView bg="line" className="mx-6 mt-3 h-px" />

      <AnimatedMovieList
        data={movies}
        keyExtractor={(item, index) => `${String(item.id)}-${index}`}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={SNAP}
        snapToAlignment="start"
        decelerationRate="normal"
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={{
          paddingHorizontal: GUTTER,
          paddingTop: 18,
          paddingBottom: 4,
        }}
        onEndReached={loadNext}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={false}
      />
    </Animated.View>
  );
};

export default SectionCarousel;
