import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/presentation/providers/theme-provider';

export type SurfaceTone = 'paper' | 'line' | 'accent';

interface Props extends ViewProps {
  bg?: SurfaceTone;
}

/**
 * Superficie con `backgroundColor` del theme por `bg` (reactivo a dark/light).
 * El color de fondo va primero para que dimensiones/bordes pasados por `style`
 * (o `className`) se mantengan. Para fondos animados/con sombra usar useTheme
 * directo: este wrapper es para superficies planas (Flat-Chrome).
 */
export const ThemedView = ({ bg = 'paper', style, ...rest }: Props) => {
  const { colors } = useTheme();
  const backgroundColor =
    bg === 'line'
      ? colors.line
      : bg === 'accent'
        ? colors.accent.DEFAULT
        : colors.paper;

  return <View style={[{ backgroundColor }, style]} {...rest} />;
};

export default ThemedView;
