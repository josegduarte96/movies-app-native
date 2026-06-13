import { View, type ViewProps } from 'react-native';

export type SurfaceTone = 'paper' | 'line' | 'accent';

const TONE_BG: Record<SurfaceTone, string> = {
  paper: 'bg-paper',
  line: 'bg-line',
  accent: 'bg-accent',
};

interface Props extends ViewProps {
  bg?: SurfaceTone;
}

/**
 * Superficie con `backgroundColor` del theme por `bg` (reactivo a light/dark/
 * system vía tokens NativeWind). Para fondos animados/con sombra usar useTheme
 * directo: este wrapper es para superficies planas (Flat-Chrome).
 */
export const ThemedView = ({ bg = 'paper', className, ...rest }: Props) => {
  return <View className={`${TONE_BG[bg]} ${className ?? ''}`} {...rest} />;
};

export default ThemedView;
