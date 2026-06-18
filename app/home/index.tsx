import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { ROUTES } from '@/presentation/navigation/routes';
import { flattenPages } from '@/presentation/utils/pagination';
import { STRINGS } from '@/presentation/constants/strings';

interface Section {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
}

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
      ...STRINGS.home.sections.nowPlaying,
      movies: flattenPages(nowPlaying.data),
      isLoading: nowPlaying.isLoading,
      isError: nowPlaying.isError,
      fetchNextPage: nowPlaying.fetchNextPage,
    },
    {
      ...STRINGS.home.sections.topRated,
      movies: flattenPages(topRated.data),
      isLoading: topRated.isLoading,
      isError: topRated.isError,
      fetchNextPage: topRated.fetchNextPage,
    },
    {
      ...STRINGS.home.sections.popular,
      movies: flattenPages(popular.data),
      isLoading: popular.isLoading,
      isError: popular.isError,
      fetchNextPage: popular.fetchNextPage,
    },
  ];

  const openMovie = (movie: Movie) => router.push(ROUTES.movieDetail(movie.id));

  const allLoading = sections.every((s) => s.isLoading);
  const allError = sections.every((s) => s.isError);
  const allEmpty = sections.every((s) => !s.isLoading && s.movies.length === 0);

  return (
    <ThemedView className="flex-1">
      <HomeHeader
        topInset={insets.top}
        onSearch={() => router.push(ROUTES.search)}
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
            label={STRINGS.common.error}
            body={STRINGS.home.errorBody}
          />
        ) : allEmpty ? (
          <StateBlock
            icon="film-outline"
            label={STRINGS.home.emptyTitle}
            body={STRINGS.home.emptyBody}
          />
        ) : (
          sections.map((section, index) =>
            section.movies.length > 0 ? (
              <SectionCarousel
                key={section.title}
                title={section.title}
                icon={section.icon}
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
