import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/presentation/providers/theme-provider';

export type TextTone = 'ink' | 'soft' | 'accent' | 'accent-soft';

interface Props extends TextProps {
  tone?: TextTone;
}

/**
 * Texto con color del theme inyectado por `tone` (reactivo a dark/light vía
 * useTheme → useColorScheme). El resto del estilo tipográfico (fontSize,
 * lineHeight, fontVariant…) y `className` (NativeWind) se pasan tal cual; el
 * color va primero para que un `style` explícito pueda sobreescribirlo.
 */
export const ThemedText = ({ tone = 'ink', style, ...rest }: Props) => {
  const { colors } = useTheme();
  const color =
    tone === 'soft'
      ? colors.ink.soft
      : tone === 'accent'
        ? colors.accent.DEFAULT
        : tone === 'accent-soft'
          ? colors.accent.soft
          : colors.ink.DEFAULT;

  return <Text style={[{ color }, style]} {...rest} />;
};

export default ThemedText;
