import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useGetMovieDetails } from '@/presentation/hooks/movies/use-get-details';
import { colors } from '@/config/theme/colors';
import MovieDetailHero from '@/presentation/components/movies/MovieDetailHero';

const HERO_RATIO = 0.62;

const Loader = ({ height }: { height: number }) => (
  <View style={{ height }} className="items-center justify-center bg-paper">
    <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
  </View>
);

const ErrorState = () => (
  <View className="flex-1 items-center justify-center bg-paper px-10">
    <Text className="font-editorial text-sm uppercase tracking-[3px] text-accent">
      Algo salió mal
    </Text>
    <Text className="mt-2 text-center font-editorial text-sm text-ink-soft">
      No pudimos cargar la información de esta película.
    </Text>
  </View>
);

const MetadataChip = ({ label }: { label: string }) => (
  <View className="rounded bg-line p-2">
    <Text className="font-editorial text-ink">{label}</Text>
  </View>
);

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { data, isLoading } = useGetMovieDetails(Number(id));

  const backOffsetTop = insets.top + 16;
  const backScale = useSharedValue(1);
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const heroHeight = screenHeight * HERO_RATIO;

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper">
        <Loader height={heroHeight} />
      </View>
    );
  }

  if (!data) {
    return <ErrorState />;
  }

  return (
    <View className="flex-1 bg-paper">
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View
        entering={!reducedMotion ? FadeIn.duration(400).delay(150) : undefined}
        style={[{ top: backOffsetTop }, backAnimatedStyle]}
        className="absolute left-4 z-10">
        <Pressable
          onPress={() => router.back()}
          onPressIn={() => {
            backScale.value = withSpring(0.88, { damping: 12 });
          }}
          onPressOut={() => {
            backScale.value = withSpring(1, { damping: 12 });
          }}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40">
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
      </Animated.View>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
        <MovieDetailHero
          backdropPath={data.posterPath}
          heroHeight={heroHeight}
        />

        <Animated.View
          entering={
            !reducedMotion ? FadeInDown.duration(500).delay(200) : undefined
          }
          className="px-6 pt-6">
          <View className="flex-row gap-4">
            <View className="flex-1 justify-center">
              <Text className="font-display text-4xl leading-tight text-ink">
                {data.title}
              </Text>
              {data.tagline ? (
                <Text className="mt-1 font-editorial text-2xl italic text-ink-soft">
                  {data.tagline}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-6 flex-row flex-wrap gap-3">
            {data.runtime > 0 ? (
              <MetadataChip label={`${data.runtime} min`} />
            ) : null}
            <MetadataChip label={String(data.releaseDate.getFullYear())} />
            <MetadataChip label={data.status} />
          </View>

          {data.overview ? (
            <View className="mt-6">
              <Text className="font-display text-3xl text-ink">Sinopsis</Text>
              <Text className="mt-2 font-editorial text-lg leading-6 text-ink">
                {data.overview}
              </Text>
            </View>
          ) : null}

          {data.productionCompanies.length > 0 ? (
            <View className="mt-8">
              <Text className="font-editorial uppercase tracking-[3px] text-accent">
                Producción
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-4">
                {data.productionCompanies.map((c) => (
                  <View
                    key={c.id}
                    className="items-center"
                    style={{ width: 80 }}>
                    {c.logoPath && c.logoPath !== 'no-logo' ? (
                      <Image
                        source={{ uri: c.logoPath }}
                        style={{ width: 40, height: 40 }}
                        className="rounded-full bg-line"
                        contentFit="contain"
                      />
                    ) : (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-line">
                        <Text className="font-editorial text-sm text-ink-soft">
                          {c.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <Text
                      className="mt-1 text-center font-editorial text-sm text-ink"
                      numberOfLines={2}>
                      {c.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {data.spokenLanguages.length > 0 ? (
            <View className="mt-6">
              <Text className="font-editorial text-sm uppercase tracking-[3px] text-accent">
                Idiomas
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {data.spokenLanguages.map((l) => (
                  <MetadataChip key={l.iso639_1} label={l.englishName} />
                ))}
              </View>
            </View>
          ) : null}

          {data.homepage ? (
            <View className="mt-6 pb-12">
              <Text className="font-editorial uppercase tracking-[3px] text-accent">
                Sitio web
              </Text>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(data.homepage)}
                hitSlop={8}>
                <Text className="mt-1 font-editorial text-ink underline">
                  {data.homepage}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
