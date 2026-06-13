import { Pressable, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useGetMovieDetails } from '@/presentation/hooks/movies/use-get-details';
import { useGetMovieCredits } from '@/presentation/hooks/movies/use-get-movie-credits';
import ParallaxHero from '@/presentation/components/movies/ParallaxHero';
import CastList from '@/presentation/components/movies/CastList';
import MetaChip from '@/presentation/components/ui/MetaChip';
import StateBlock from '@/presentation/components/ui/StateBlock';
import { SkeletonBox } from '@/presentation/components/ui/Skeleton';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { ThemedView } from '@/presentation/components/ui/ThemedView';
import { useTheme } from '@/presentation/providers/theme-provider';

const HERO_RATIO = 0.62;
const BACK_SPRING = { damping: 12, stiffness: 220 };

// Eyebrow: etiqueta tracked en mayúsculas, rojo ladrillo (la firma del sistema).
const Eyebrow = ({ children }: { children: string }) => (
  <ThemedText
    tone="accent"
    style={{ fontSize: 12, letterSpacing: 3 }}
    className="font-editorial uppercase">
    {children}
  </ThemedText>
);

const DetailSkeleton = ({
  heroHeight,
  color,
}: {
  heroHeight: number;
  color: string;
}) => (
  <ThemedView className="flex-1" style={{ backgroundColor: color }}>
    <SkeletonBox
      style={{
        height: heroHeight,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    />
    <View className="px-6 pt-6">
      <SkeletonBox style={{ height: 30, width: '68%', borderRadius: 5 }} />
      <SkeletonBox
        style={{ height: 16, width: '46%', borderRadius: 4, marginTop: 14 }}
      />
      <View className="mt-5 flex-row gap-2.5">
        {[64, 52, 90].map((w, i) => (
          <SkeletonBox
            key={i}
            style={{ height: 34, width: w, borderRadius: 4 }}
          />
        ))}
      </View>
      <SkeletonBox
        style={{ height: 13, width: 90, borderRadius: 4, marginTop: 30 }}
      />
      {[96, 90, 84, 60].map((w, i) => (
        <SkeletonBox
          key={i}
          style={{
            height: 11,
            width: `${w}%`,
            borderRadius: 4,
            marginTop: i === 0 ? 12 : 9,
          }}
        />
      ))}
    </View>
  </ThemedView>
);

const BackButton = ({
  topOffset,
  onPress,
}: {
  topOffset: number;
  onPress: () => void;
}) => {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(400).delay(150)}
      style={[{ top: topOffset }, style]}
      className="absolute left-4 z-10">
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          if (!reducedMotion) scale.value = withSpring(0.88, BACK_SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, BACK_SPRING);
        }}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        className="h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40">
        <Ionicons name="arrow-back" size={22} color="#ffffff" />
      </Pressable>
    </Animated.View>
  );
};

export default function MovieDetailScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const { data, isLoading } = useGetMovieDetails(Number(id));
  const { data: cast } = useGetMovieCredits(Number(id));

  const heroHeight = screenHeight * HERO_RATIO;
  const backOffsetTop = insets.top + 16;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  if (isLoading) {
    return (
      <ThemedView className="flex-1">
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton topOffset={backOffsetTop} onPress={() => router.back()} />
        <DetailSkeleton heroHeight={heroHeight} color={colors.paper} />
      </ThemedView>
    );
  }

  if (!data) {
    return (
      <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton topOffset={backOffsetTop} onPress={() => router.back()} />
        <View className="flex-1 justify-center">
          <StateBlock
            icon="cloud-offline-outline"
            label="Algo salió mal"
            body="No pudimos cargar la información de esta película."
          />
        </View>
      </ThemedView>
    );
  }

  const year = data.releaseDate.getFullYear();
  const country = data.originCountry?.[0];
  const eyebrow = country
    ? `${country} · ${Number.isNaN(year) ? '' : year}`.trim()
    : Number.isNaN(year)
      ? ''
      : String(year);

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton topOffset={backOffsetTop} onPress={() => router.back()} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <ParallaxHero
          uri={data.posterPath}
          heroHeight={heroHeight}
          scrollY={scrollY}
        />

        <Animated.View
          entering={
            reducedMotion ? undefined : FadeInDown.duration(500).delay(200)
          }
          className="pt-6">
          {eyebrow ? (
            <View className="mb-3 px-6">
              <ThemedText
                tone="accent"
                style={{
                  fontSize: 13,
                  letterSpacing: 3,
                  fontVariant: ['tabular-nums'],
                }}
                className="font-editorial uppercase">
                {eyebrow}
              </ThemedText>
              <ThemedView bg="accent" className="mt-3 h-[3px] w-16" />
            </View>
          ) : null}

          <ThemedText
            style={{ fontSize: 36, lineHeight: 40 }}
            className="px-6 font-display">
            {data.title}
          </ThemedText>

          {data.tagline ? (
            <ThemedText
              tone="soft"
              style={{ fontSize: 20, lineHeight: 27 }}
              className="mt-2 px-6 font-editorial-italic">
              {data.tagline}
            </ThemedText>
          ) : null}

          <View className="mt-5 flex-row flex-wrap gap-2.5 px-6">
            {data.runtime > 0 ? (
              <MetaChip label={`${data.runtime} min`} />
            ) : null}
            {!Number.isNaN(year) ? <MetaChip label={String(year)} /> : null}
            {data.status ? <MetaChip label={data.status} /> : null}
          </View>

          {data.overview ? (
            <View className="mt-7 px-6">
              <ThemedText
                style={{ fontSize: 28, lineHeight: 32 }}
                className="font-display">
                Sinopsis
              </ThemedText>
              <ThemedText
                style={{ fontSize: 16, lineHeight: 25 }}
                className="mt-2.5 font-editorial">
                {data.overview}
              </ThemedText>
            </View>
          ) : null}

          <CastList cast={cast ?? []} />

          {data.productionCompanies.length > 0 ? (
            <View className="mt-7 px-6">
              <Eyebrow>Producción</Eyebrow>
              <View className="mt-3 flex-col flex-wrap gap-4">
                {data.productionCompanies.map((company) => (
                  <View
                    key={company.id}
                    className="flex-row items-center gap-2.5"
                    style={{ maxWidth: 240 }}>
                    {company.logoPath && company.logoPath !== 'no-logo' ? (
                      <View
                        style={{
                          padding: 5,
                          borderRadius: 10,
                          backgroundColor: isDark
                            ? colors.ink.soft
                            : colors.line,
                        }}>
                        <Image
                          source={{ uri: company.logoPath }}
                          style={{
                            width: 58,
                            height: 58,
                          }}
                          contentFit="scale-down"
                        />
                      </View>
                    ) : (
                      <ThemedView
                        bg="line"
                        className="h-[38px] w-[38px] items-center justify-center rounded-full">
                        <ThemedText
                          tone="soft"
                          style={{ fontSize: 15 }}
                          className="font-editorial">
                          {company.name.charAt(0)}
                        </ThemedText>
                      </ThemedView>
                    )}
                    <ThemedText
                      style={{ fontSize: 14 }}
                      className="font-editorial"
                      numberOfLines={2}>
                      {company.name}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {data.spokenLanguages.length > 0 ? (
            <View className="mt-7 px-6">
              <Eyebrow>Idiomas</Eyebrow>
              <View className="mt-3 flex-row flex-wrap gap-2.5">
                {data.spokenLanguages.map((lang) => (
                  <MetaChip key={lang.iso639_1} label={lang.englishName} />
                ))}
              </View>
            </View>
          ) : null}

          {data.homepage ? (
            <View className="mt-7">
              <Eyebrow>Sitio web</Eyebrow>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(data.homepage)}
                hitSlop={8}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <ThemedText
                  style={{
                    fontSize: 15,
                    lineHeight: 21,
                    textDecorationLine: 'underline',
                    textDecorationColor: colors.accent.DEFAULT,
                  }}
                  className="mt-2 font-editorial">
                  {data.homepage}
                </ThemedText>
              </Pressable>
            </View>
          ) : null}
        </Animated.View>
      </Animated.ScrollView>
    </ThemedView>
  );
}
