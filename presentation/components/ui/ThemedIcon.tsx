import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/presentation/providers/theme-provider';

export type IconTone = 'ink' | 'soft' | 'accent';

type Props = Omit<ComponentProps<typeof Ionicons>, 'color'> & {
  tone?: IconTone;
};

/**
 * Ionicons con color del theme por `tone` (reactivo a dark/light). Para íconos
 * con color animado/condicional (p. ej. campo de búsqueda en foco) usar
 * Ionicons directo + useTheme.
 */
export const ThemedIcon = ({ tone = 'ink', ...rest }: Props) => {
  const { colors } = useTheme();
  const color =
    tone === 'soft'
      ? colors.ink.soft
      : tone === 'accent'
        ? colors.accent.DEFAULT
        : colors.ink.DEFAULT;

  return <Ionicons color={color} {...rest} />;
};

export default ThemedIcon;
