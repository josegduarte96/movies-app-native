import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useNowPlaying,
  usePopularsMovies,
  useSearchMovies,
  useTopRatedMovies,
} from '@/presentation/hooks/movies';
import {
  HomeHeader,
  MainSlideshow,
  SearchResults,
} from '@/presentation/components/movies';
import SectionLoader from '@/presentation/components/ui/SectionLoader';
import { Movie } from '@/core/entities/movie.entity';

interface Section {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  fetchNextPage: () => void;
}

const flattenPages = <T,>(
  data: { pages: { results: T[] }[] } | undefined,
): T[] => data?.pages.flatMap((p) => p.results) ?? [];

const MovieFeed = ({
  sections,
  bottomInset,
}: {
  sections: Section[];
  bottomInset: number;
}) => (
  <ScrollView
    className="flex-1"
    keyboardDismissMode="on-drag"
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ paddingBottom: bottomInset }}>
    <View className="mt-7">
      {sections.map(({ title, movies, isLoading, fetchNextPage }) =>
        isLoading ? (
          <SectionLoader key={title} />
        ) : (
          <MainSlideshow
            key={title}
            movies={movies}
            title={title}
            loadNextMovies={fetchNextPage}
          />
        ),
      )}
    </View>
  </ScrollView>
);

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const search = useSearchMovies(searchQuery);
  const nowPlaying = useNowPlaying();
  const topRated = useTopRatedMovies();
  const popular = usePopularsMovies();

  const sections: Section[] = [
    {
      title: 'En cartelera',
      movies: flattenPages(nowPlaying.data),
      isLoading: nowPlaying.isLoading,
      fetchNextPage: nowPlaying.fetchNextPage,
    },
    {
      title: 'Mejor calificadas',
      movies: flattenPages(topRated.data),
      isLoading: topRated.isLoading,
      fetchNextPage: topRated.fetchNextPage,
    },
    {
      title: 'Populares',
      movies: flattenPages(popular.data),
      isLoading: popular.isLoading,
      fetchNextPage: popular.fetchNextPage,
    },
  ];

  const isSearching = searchQuery.trim().length > 0;

  return (
    <View className="flex-1 bg-paper" style={{ paddingTop: insets.top }}>
      <HomeHeader onQueryChange={setSearchQuery} />

      <View className="flex-1">
        <MovieFeed sections={sections} bottomInset={insets.bottom} />
        {isSearching && (
          <View className="absolute inset-0 bg-paper">
            <SearchResults
              movies={flattenPages(search.data)}
              isLoading={search.isLoading}
              isError={search.isError}
              hasNextPage={search.hasNextPage}
              fetchNextPage={search.fetchNextPage}
              bottomInset={insets.bottom}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
