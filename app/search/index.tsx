import { useEffect, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { useSearchMovies } from '@/presentation/hooks/movies';
import SearchField from '@/presentation/components/movies/SearchField';
import ResultRow from '@/presentation/components/movies/ResultRow';
import StateBlock from '@/presentation/components/ui/StateBlock';
import { SkeletonRow } from '@/presentation/components/ui/Skeleton';
import { ThemedIcon } from '@/presentation/components/ui/ThemedIcon';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { ThemedView } from '@/presentation/components/ui/ThemedView';
import MetaChip from '@/presentation/components/ui/MetaChip';
import { ROUTES } from '@/presentation/navigation/routes';
import { flattenPages } from '@/presentation/utils/pagination';
import { STRINGS } from '@/presentation/constants/strings';
import { DURATION, OPACITY } from '@/presentation/constants/motion';
import { EYEBROW } from '@/presentation/constants/typography';

// Estado vacío inicial: invitación + chips de sugerencias (directores spot).
const EmptyPrompt = ({ onPick }: { onPick: (term: string) => void }) => {
  return (
    <View className="px-6">
      <ThemedText
        tone="soft"
        className="px-4 py-8 text-center font-editorial-italic text-[15px] leading-6">
        {STRINGS.search.prompt}
      </ThemedText>
      <ThemedText
        tone="accent"
        style={EYEBROW}
        className="mt-2 font-editorial uppercase">
        {STRINGS.search.suggestionsLabel}
      </ThemedText>
      <View className="mt-3.5 flex-row flex-wrap gap-2.5">
        {STRINGS.search.suggestions.map((term) => (
          <Pressable
            key={term}
            onPress={() => onPick(term)}
            accessibilityRole="button"
            style={({ pressed }) => ({
              opacity: pressed ? OPACITY.pressed : 1,
            })}
            className="bg-line">
            <MetaChip label={term} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce de 450ms tras la última tecla antes de pegarle a TMDB.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      if (timer.current) clearTimeout(timer.current);
      setDebounced('');
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(trimmed), DURATION.debounce);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const search = useSearchMovies(debounced);
  const movies = flattenPages(search.data);

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  // Skeleton mientras se teclea (debounce pendiente) o en el primer fetch.
  const isPending = hasQuery && (debounced !== trimmed || search.isLoading);

  const pickSuggestion = (term: string) => {
    setQuery(term);
    setDebounced(term);
  };

  const handleEndReached = () => {
    if (search.hasNextPage && !search.isFetchingNextPage)
      search.fetchNextPage();
  };

  const renderBody = () => {
    if (!hasQuery) {
      return <EmptyPrompt onPick={pickSuggestion} />;
    }
    if (isPending) {
      return (
        <View>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </View>
      );
    }
    if (search.isError) {
      return (
        <StateBlock
          icon="alert-circle-outline"
          label={STRINGS.search.errorLabel}
          body={STRINGS.search.errorBody}
        />
      );
    }
    if (movies.length === 0) {
      return (
        <StateBlock
          icon="film-outline"
          label={STRINGS.search.emptyLabel}
          body={STRINGS.search.emptyBody(trimmed)}
        />
      );
    }
    return (
      <FlatList
        data={movies}
        keyExtractor={(item, index) => `${String(item.id)}-${index}`}
        renderItem={({ item, index }) => {
          const entering =
            reducedMotion || index >= 8
              ? undefined
              : FadeInDown.duration(260).delay(index * 45);
          return (
            <Animated.View entering={entering}>
              <ResultRow
                movie={item}
                onOpen={() => router.push(ROUTES.movieDetail(item.id))}
              />
            </Animated.View>
          );
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />
    );
  };

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false, animation: 'flip' }} />

      {/* Cabecera: volver + campo de búsqueda con borde rojo en foco. */}
      <View className="flex-row items-center gap-3 px-6 pb-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.a11y.back}
          style={({ pressed }) => ({
            opacity: pressed ? OPACITY.pressedStrong : 1,
          })}>
          <ThemedIcon name="arrow-back" size={22} />
        </Pressable>
        <SearchField
          autoFocus
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />
      </View>

      <View className="flex-1">{renderBody()}</View>
    </ThemedView>
  );
};

export default SearchScreen;
