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

interface Props {
  topInset: number;
  onSearch: () => void;
}

const NAMEPLATE_REST = 30;
// Apertura escalonada de la portada: el cliché sube tras la regla, luego la
// regla + standfirst, y por último el buscador. Cada paso 110ms después.
const COVER_MS = 520;
const COVER_STEP = 110;

// Icono y etiqueta por modo de tema (el botón cicla system → light → dark).
const MODE_ICON = {
  system: 'phone-portrait-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
} as const;
const MODE_LABEL = { system: 'sistema', light: 'claro', dark: 'oscuro' };

const HomeHeader = ({ topInset, onSearch }: Props) => {
  const { colors, mode, cycleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const reveal = (step: number) =>
    reducedMotion
      ? undefined
      : FadeInDown.duration(COVER_MS).delay(step * COVER_STEP);

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
      accessibilityLabel={'Cinemateca'}
      style={[
        {
          paddingTop: topInset,
          zIndex: 10,
          shadowColor: colors.ink.DEFAULT,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 22,
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
            Cinemateca
          </Animated.Text>
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(420).delay(80)}>
          <Pressable
            onPress={onToggle}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Tema ${MODE_LABEL[mode]}, tocar para cambiar`}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
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
            una sala de repertorio
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
          accessibilityLabel="Buscar películas"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          className="mb-1.5 mt-6 flex-row items-center rounded-xl border-[1.5px] border-ink-soft bg-paper px-4 py-3">
          <Ionicons name="search-outline" size={19} color={colors.ink.soft} />
          <Text
            style={{ fontSize: 16 }}
            className="ml-2.5 font-editorial text-ink-soft">
            Buscar películas
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

export default HomeHeader;
