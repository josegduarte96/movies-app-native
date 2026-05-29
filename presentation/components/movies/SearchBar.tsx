import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/config/theme/colors';

interface Props {
  onQueryChange: (query: string) => void;
}

const DEBOUNCE_MS = 400;
const ICON_SIZE = 20;
const FOCUS_MS = 200;

const SearchBar = ({ onQueryChange }: Props) => {
  const [localQuery, setLocalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const focus = useSharedValue(0);

  // Limpia el debounce pendiente al desmontar: evita disparar onQueryChange
  // sobre un componente ya ido.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // El foco mueve el borde de hairline a brick con una transición suave; la
  // señal de color basta, sin glow ni sombra (Flat-Chrome).
  const setFocus = (value: boolean) => {
    setIsFocused(value);
    focus.value = withTiming(value ? 1 : 0, {
      duration: reducedMotion ? 0 : FOCUS_MS,
    });
  };

  const handleChangeText = (text: string) => {
    setLocalQuery(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onQueryChange(text), DEBOUNCE_MS);
  };

  const handleClear = () => {
    setLocalQuery('');
    if (timer.current) clearTimeout(timer.current);
    onQueryChange('');
  };

  // Enviar descarga el debounce pendiente: la búsqueda no espera los 400ms.
  const handleSubmit = () => {
    if (timer.current) clearTimeout(timer.current);
    onQueryChange(localQuery);
    Keyboard.dismiss();
  };

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [colors.line, colors.accent.DEFAULT],
    ),
  }));

  const iconColor = isFocused ? colors.accent.DEFAULT : colors.ink.soft;
  const hasText = localQuery.length > 0;

  return (
    <View className="mx-6 my-4">
      <Animated.View
        style={[{ borderWidth: 1 }, borderStyle]}
        className="flex-row items-center rounded-xl bg-paper px-4 py-2">
        <Ionicons name="search" size={ICON_SIZE} color={iconColor} />
        <TextInput
          className="ml-3 flex-1 p-0 font-editorial text-ink"
          placeholder="Buscar en el repertorio…"
          placeholderTextColor={colors.ink.soft}
          value={localQuery}
          onChangeText={handleChangeText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Buscar películas"
        />
        {hasText && (
          <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(150)}>
            <Pressable
              onPress={handleClear}
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
        )}
      </Animated.View>
    </View>
  );
};

export default SearchBar;
