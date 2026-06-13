import { Text, type TextProps } from 'react-native';

export type TextTone = 'ink' | 'soft' | 'accent' | 'accent-soft';

const TONE_TEXT: Record<TextTone, string> = {
  ink: 'text-ink',
  soft: 'text-ink-soft',
  accent: 'text-accent',
  'accent-soft': 'text-accent-soft',
};

interface Props extends TextProps {
  tone?: TextTone;
}

/**
 * Texto con color del theme inyectado por `tone` (reactivo a light/dark/system
 * vía tokens NativeWind). El resto del estilo tipográfico y `className` se pasan
 * tal cual; un `style.color` explícito sigue ganando sobre el token.
 */
export const ThemedText = ({ tone = 'ink', className, ...rest }: Props) => {
  return <Text className={`${TONE_TEXT[tone]} ${className ?? ''}`} {...rest} />;
};

export default ThemedText;
