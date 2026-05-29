import { useState } from 'react';
import { Keyboard, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/presentation/providers/theme-provider';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

const ICON_SIZE = 19;
const FOCUS_MS = 160;

/**
 * Campo de búsqueda con borde animado: en foco/uso la regla hairline pasa a
 * rojo ladrillo (transición de color 160ms) y el ícono lo acompaña. Plano —
 * sin glow ni sombra; el color basta como señal (Flat-Chrome). Controlado: el
 * debounce vive en la pantalla.
 */
const SearchField = ({
  value,
  onChangeText,
  onClear,
  onSubmit,
  autoFocus,
}: Props) => {
  const { colors, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const FIELD_REST_BORDER = isDark ? colors.ink.soft : '#CFC6B5';
  const [isFocused, setIsFocused] = useState(false);
  // "Activo" = en foco o con texto: mantiene el borde rojo mientras hay query.
  const active = isFocused || value.length > 0;
  const focus = useSharedValue(0);

  const setFocus = (next: boolean) => {
    setIsFocused(next);
    focus.value = withTiming(next || value.length > 0 ? 1 : 0, {
      duration: reducedMotion ? 0 : FOCUS_MS,
    });
  };

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [FIELD_REST_BORDER, colors.accent.DEFAULT],
    ),
  }));

  const handleSubmit = () => {
    onSubmit?.();
    Keyboard.dismiss();
  };

  return (
    <Animated.View
      style={[{ borderWidth: 1.5, backgroundColor: colors.paper }, borderStyle]}
      className="flex-1 flex-row items-center rounded-xl px-3.5 py-2.5">
      <Ionicons
        name="search-outline"
        size={ICON_SIZE}
        color={active ? colors.accent.DEFAULT : colors.ink.soft}
      />
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Buscar películas"
        placeholderTextColor={colors.ink.soft}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        style={{ fontSize: 16, color: colors.ink.DEFAULT }}
        className="ml-2.5 flex-1 p-0 font-editorial"
        accessibilityLabel="Buscar películas"
      />
      {value.length > 0 ? (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(150)}>
          <Pressable
            onPress={onClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Ionicons
              name="close-circle"
              size={ICON_SIZE}
              color={colors.ink.soft}
            />
          </Pressable>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

export default SearchField;
