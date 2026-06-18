import { View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
} from 'react-native-reanimated';

import { useTheme } from '@/presentation/providers/theme-provider';
import { DURATION, SHADOW } from '@/presentation/constants/motion';

interface Props {
  uri: string;
  heroHeight: number;
  scrollY: SharedValue<number>;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

// Factor de parallax: la imagen se desplaza al 60% de la velocidad del scroll.
const PARALLAX = 0.4;

/**
 * Hero con parallax dirigido por scroll. La imagen vive en un contenedor
 * recortado (esquinas inferiores redondeadas + sombra de póster, la única
 * elevación permitida). Al subir el contenido, la imagen baja a fracción de la
 * velocidad → profundidad. Un buffer superior evita huecos. Respeta
 * reduce-motion (imagen estática) y hace zoom suave en el overscroll.
 */
const ParallaxHero = ({ uri, heroHeight, scrollY }: Props) => {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const overflow = Math.ceil(heroHeight * 0.1);
  const innerHeight = heroHeight + overflow;
  const hasImage = uri !== 'no-poster' && uri !== 'no-backdrop';

  const imageStyle = useAnimatedStyle(() => {
    if (reducedMotion) return {};
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, heroHeight],
            [0, heroHeight * PARALLAX],
            Extrapolation.CLAMP,
          ),
        },
        {
          // Overscroll (pull-down): la imagen se agranda con suavidad.
          scale: interpolate(scrollY.value, [-heroHeight, 0], [1.6, 1], {
            extrapolateRight: Extrapolation.CLAMP,
          }),
        },
      ],
    };
  });

  return (
    <View
      className="bg-line"
      style={{
        height: heroHeight,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        shadowColor: colors.ink.DEFAULT,
        ...SHADOW.hero,
      }}>
      {hasImage ? (
        <AnimatedImage
          source={{ uri }}
          contentFit="fill"
          transition={DURATION.heroImage}
          cachePolicy="memory-disk"
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: -overflow,
              height: innerHeight,
            },
            imageStyle,
          ]}
        />
      ) : null}
    </View>
  );
};

export default ParallaxHero;
