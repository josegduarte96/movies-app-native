import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/presentation/providers/theme-provider';
import { STRINGS } from '@/presentation/constants/strings';
import { COVER_STEP, DURATION, OPACITY, SHADOW } from '@/presentation/constants/motion';

interface Props {
  topInset: number;
  onSearch: () => void;
}

const NAMEPLATE_REST = 30;

// Icono por modo de tema (el botón cicla system → light → dark).
const MODE_ICON = {
  system: 'phone-portrait-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
} as const;

const HomeHeader = ({ topInset, onSearch }: Props) => {
  const { colors, mode, cycleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  // Apertura escalonada de la portada: el cliché sube tras la regla, luego la
  // regla + standfirst, y por último el buscador. Cada paso 110ms después.
  const reveal = (step: number) =>
    reducedMotion
      ? undefined
      : FadeInDown.duration(DURATION.cover).delay(step * COVER_STEP);

  // Gira el icono media vuelta y le da un rebote al alternar el tema.
  const scale = useSharedValue(1);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onToggle = () => {
    if (!reducedMotion) {
      scale.value = withSequence(
        withTiming(0.8, { duration: 130 }),
        withTiming(1, { duration: 220 }),
      );
    }
    cycleTheme();
  };

  return (
    <Animated.View
      accessible
      accessibilityRole="header"
      accessibilityLabel={STRINGS.brand.name}
      style={[
        {
          paddingTop: topInset,
          zIndex: 10,
          shadowColor: colors.ink.DEFAULT,
          ...SHADOW.header,
        },
      ]}
      className="bg-paper px-6 pb-2.5">
      <View className="flex-row items-center justify-between">
        <Animated.View className="flex-1 overflow-hidden">
          <Animated.Text
            entering={reveal(0)}
            numberOfLines={1}
            style={[
              {
                fontSize: NAMEPLATE_REST,
                lineHeight: NAMEPLATE_REST,
                letterSpacing: -0.5,
                transformOrigin: 'left top',
              },
            ]}
            className="font-display text-ink">
            {STRINGS.brand.name}
          </Animated.Text>
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(420).delay(80)}>
          <Pressable
            onPress={onToggle}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.a11y.themeToggle(STRINGS.themeModes[mode])}
            style={({ pressed }) => ({ opacity: pressed ? OPACITY.pressed : 1 })}
            className="ml-3 h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink-soft bg-paper">
            <Animated.View style={iconStyle}>
              <Ionicons
                name={MODE_ICON[mode]}
                size={20}
                color={colors.ink.DEFAULT}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>

      <Animated.View entering={reveal(1)} className="overflow-hidden">
        <View>
          <View className="mb-3 mt-3.5 h-[3px] w-16 bg-accent" />
          <Text className="font-editorial-italic text-xl text-ink-soft">
            {STRINGS.brand.tagline}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={
          reducedMotion
            ? undefined
            : FadeIn.duration(420).delay(2 * COVER_STEP + 80)
        }>
        <Pressable
          onPress={onSearch}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.a11y.searchMovies}
          style={({ pressed }) => ({ opacity: pressed ? OPACITY.pressed : 1 })}
          className="mb-1.5 mt-6 flex-row items-center rounded-xl border-[1.5px] border-ink-soft bg-paper px-4 py-3">
          <Ionicons name="search-outline" size={19} color={colors.ink.soft} />
          <Text
            style={{ fontSize: 16 }}
            className="ml-2.5 font-editorial text-ink-soft">
            {STRINGS.search.placeholder}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

export default HomeHeader;
