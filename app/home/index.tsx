import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import {
  useNowPlaying,
  usePopularsMovies,
  useTopRatedMovies,
} from '@/presentation/hooks/movies';
import HomeHeader from '@/presentation/components/movies/HomeHeader';
import SectionCarousel from '@/presentation/components/movies/SectionCarousel';
import StateBlock from '@/presentation/components/ui/StateBlock';
import { ThemedView } from '@/presentation/components/ui/ThemedView';
import {
  SkeletonBox,
  SkeletonCard,
} from '@/presentation/components/ui/Skeleton';
import { Movie } from '@/core/entities/movie.entity';

interface Section {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
}

const flattenPages = <T,>(
  data: { pages: { results: T[] }[] } | undefined,
): T[] => data?.pages.flatMap((p) => p.results) ?? [];

// Skeleton de una sección: cabecera + hairline + tres tarjetas-póster.
const SkeletonSection = () => {
  return (
    <View className="mt-7">
      <View className="px-6">
        <SkeletonBox style={{ height: 13, width: 150, borderRadius: 4 }} />
      </View>
      <ThemedView bg="line" className="mx-6 mt-3 h-px" />
      <View className="flex-row gap-4 px-6 pb-1 pt-[18px]">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const nowPlaying = useNowPlaying();
  const topRated = useTopRatedMovies();
  const popular = usePopularsMovies();

  const sections: Section[] = [
    {
      title: 'En cartelera',
      movies: flattenPages(nowPlaying.data),
      isLoading: nowPlaying.isLoading,
      isError: nowPlaying.isError,
      fetchNextPage: nowPlaying.fetchNextPage,
    },
    {
      title: 'Mejor calificadas',
      movies: flattenPages(topRated.data),
      isLoading: topRated.isLoading,
      isError: topRated.isError,
      fetchNextPage: topRated.fetchNextPage,
    },
    {
      title: 'Populares',
      movies: flattenPages(popular.data),
      isLoading: popular.isLoading,
      isError: popular.isError,
      fetchNextPage: popular.fetchNextPage,
    },
  ];

  const openMovie = (movie: Movie) =>
    router.push({ pathname: '/movie/[id]', params: { id: String(movie.id) } });

  const allLoading = sections.every((s) => s.isLoading);
  const allError = sections.every((s) => s.isError);
  const allEmpty = sections.every((s) => !s.isLoading && s.movies.length === 0);

  return (
    <ThemedView className="flex-1">
      <HomeHeader
        topInset={insets.top}
        onSearch={() => router.push('/search')}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {allLoading ? (
          <>
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </>
        ) : allError ? (
          <StateBlock
            icon="cloud-offline-outline"
            label="Algo salió mal"
            body="No pudimos cargar la cartelera. Vuelve a intentarlo en un momento."
          />
        ) : allEmpty ? (
          <StateBlock
            icon="film-outline"
            label="Sin cartelera"
            body="No hay estrenos ahora mismo. Vuelve más tarde para ver la nueva programación."
          />
        ) : (
          sections.map((section, index) =>
            section.movies.length > 0 ? (
              <SectionCarousel
                key={section.title}
                title={section.title}
                movies={section.movies}
                order={index}
                onOpen={openMovie}
                loadNext={section.fetchNextPage}
              />
            ) : section.isLoading ? (
              <SkeletonSection key={section.title} />
            ) : null,
          )
        )}
      </Animated.ScrollView>
    </ThemedView>
  );
};

export default HomeScreen;
