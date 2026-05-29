import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Movie } from '@/core/entities/movie.entity';
import { colors } from '@/config/theme/colors';

interface Props {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  bottomInset?: number;
}

const THUMBNAIL_WIDTH = 60;
const POSTER_RATIO = 1.5;
const THUMBNAIL_HEIGHT = Math.round(THUMBNAIL_WIDTH * POSTER_RATIO);
// Stagger sólo la primera pantalla: con la virtualización de FlatList los
// índices se reciclan al scrollear, así el retardo no se acumula sin fin.
const MAX_STAGGER_ITEMS = 8;
const STAGGER_MS = 45;
const PRESS_SPRING = { damping: 20, stiffness: 320, mass: 0.5 };

// Estado a pantalla completa (error / vacío): mismo layout, distinto ícono y copy.
const StateMessage = ({
  icon,
  title,
  message,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}) => {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(240)}
      className="flex-1 items-center justify-center px-10">
      <Ionicons name={icon} size={40} color={colors.accent.DEFAULT} />
      <Text className="mt-4 font-editorial text-sm uppercase tracking-[3px] text-accent">
        {title}
      </Text>
      <Text className="mt-2 text-center font-editorial text-base text-ink-soft">
        {message}
      </Text>
    </Animated.View>
  );
};

const SearchResultItem = ({
  movie,
  index,
}: {
  movie: Movie;
  index: number;
}) => {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const year = movie.releaseDate.getFullYear();
  const hasPoster = movie.posterPath !== 'no-poster';

  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (reducedMotion) return;
    scale.value = withSpring(0.97, PRESS_SPRING);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
  };

  const entering = reducedMotion
    ? undefined
    : FadeInDown.duration(260).delay(
        Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_MS,
      );

  return (
    <Animated.View entering={entering}>
      <Pressable
        onPress={() => router.push(`/movie/${movie.id}` as any)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${movie.title}, ${year}`}>
        <Animated.View
          style={pressStyle}
          className="mx-6 flex-row border-b border-line py-3">
          <View
            style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
            className="overflow-hidden rounded-lg bg-line">
            {hasPoster ? (
              <Image
                source={{ uri: movie.posterPath }}
                style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : null}
          </View>
          <View className="ml-4 flex-1 justify-center">
            <Text className="font-display text-lg text-ink" numberOfLines={2}>
              {movie.title}
            </Text>
            {!isNaN(year) ? (
              <Text className="mt-0.5 font-editorial text-sm text-accent-soft">
                {year}
              </Text>
            ) : null}
            {movie.overview ? (
              <Text
                className="mt-1 font-editorial text-sm leading-5 text-ink-soft"
                numberOfLines={2}>
                {movie.overview}
              </Text>
            ) : null}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const SkeletonItem = () => {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withRepeat(withTiming(0.85, { duration: 800 }), -1, true);
  }, [reducedMotion, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={pulseStyle}
      className="mx-6 flex-row border-b border-line py-3">
      <View
        style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
        className="rounded-lg bg-line"
      />
      <View className="ml-4 flex-1 justify-center gap-2">
        <View className="h-4 w-3/4 rounded bg-line" />
        <View className="h-3 w-1/4 rounded bg-line" />
        <View className="h-3 w-full rounded bg-line" />
      </View>
    </Animated.View>
  );
};

const SearchResults = ({
  movies,
  isLoading,
  isError,
  hasNextPage,
  fetchNextPage,
  bottomInset,
}: Props) => {
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isLoading) fetchNextPage();
  }, [hasNextPage, isLoading, fetchNextPage]);

  if (isError) {
    return (
      <StateMessage
        icon="alert-circle-outline"
        title="Error"
        message="No pudimos completar la búsqueda. Intenta de nuevo."
      />
    );
  }

  if (isLoading) {
    return (
      <View className="mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <StateMessage
        icon="film-outline"
        title="Sin resultados"
        message="No encontramos películas que coincidan con tu búsqueda."
      />
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item, index) => `${String(item.id)}-${index}`}
      renderItem={({ item, index }) => (
        <SearchResultItem movie={item} index={index} />
      )}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      contentContainerStyle={{ paddingBottom: bottomInset ?? 0 }}
      ListFooterComponent={
        hasNextPage ? (
          <View className="py-6">
            <ActivityIndicator size="small" color={colors.accent.DEFAULT} />
          </View>
        ) : null
      }
    />
  );
};

export default SearchResults;
