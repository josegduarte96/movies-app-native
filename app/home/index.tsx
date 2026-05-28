import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useNowPlaying,
  usePopularsMovies,
  useTopRatedMovies,
} from '@/presentation/hooks/movies';
import { MainSlideshow } from '@/presentation/components/movies';
import SectionLoader from '@/presentation/components/ui/SectionLoader';

const flattenPages = <T,>(
  data: { pages: { results: T[] }[] } | undefined,
): T[] => data?.pages.flatMap((p) => p.results) ?? [];

const HomeScreen = () => {
  const nowPlaying = useNowPlaying();
  const popular = usePopularsMovies();
  const topRated = useTopRatedMovies();

  const sections = [
    {
      query: nowPlaying,
      movies: flattenPages(nowPlaying.data),
      title: 'En cartelera',
    },
    {
      query: topRated,
      movies: flattenPages(topRated.data),
      title: 'Mejor calificadas',
    },
    { query: popular, movies: flattenPages(popular.data), title: 'Populares' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView className="flex-1">
        <Text className="px-6 pt-2 font-display text-3xl text-ink">
          Movies App
        </Text>
        <View className="mt-7">
          {sections.map(
            ({ query: { isLoading, fetchNextPage }, movies, title }, index) =>
              isLoading ? (
                <SectionLoader key={index} />
              ) : (
                <MainSlideshow
                  key={index}
                  movies={movies}
                  title={title}
                  loadNextMovies={fetchNextPage}
                />
              ),
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
