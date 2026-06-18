/**
 * Tokens de movimiento: duraciones, springs, opacidades de pulsación y sombras.
 * Centralizan los números mágicos de animación dispersos por los componentes.
 *
 * Nota Reanimated: se leen dentro de worklets (withTiming/withSpring/
 * useAnimatedStyle). Por ser primitivas y objetos congelados son capturables
 * de forma segura. NO mover aquí la lógica de interpolate/interpolateColor.
 */

/** Duraciones en ms. */
export const DURATION = {
  focus: 160, // borde del SearchField al enfocar
  pressIn: 120, // hundido del póster al presionar
  imageFade: 300, // transición de imagen del póster (expo-image)
  heroImage: 400, // transición de imagen del hero (expo-image)
  debounce: 450, // espera de búsqueda tras la última tecla
  cover: 520, // apertura escalonada de la portada (HomeHeader)
  themeFade: 340, // crossfade global al alternar tema
  pulse: 800, // pulso del skeleton
} as const;

/** Paso entre reveals escalonados de la portada (HomeHeader). */
export const COVER_STEP = 110;

/** Inactividad tras interacción manual antes de reanudar el autoplay (CastList). */
export const RESUME_DELAY = 2500;

/** Velocidad del autoplay del carrusel de reparto (px/s). */
export const AUTO_SPEED = 100;

/** Configuraciones de spring del design system. */
export const SPRING = {
  back: { damping: 12, stiffness: 220 }, // botón volver del detalle
  poster: { damping: 14, stiffness: 220 }, // soltar el póster
  row: { damping: 20, stiffness: 400, mass: 0.5 }, // filas de resultados (tight)
} as const;

/** Opacidades de feedback al presionar (Pressable). */
export const OPACITY = {
  pressed: 0.6,
  pressedStrong: 0.5,
  skeletonMin: 0.45,
  skeletonMax: 0.85,
} as const;

/**
 * Sombras (la única elevación permitida). El `shadowColor` se inyecta en runtime
 * con `colors.ink.DEFAULT`; aquí solo viven offset/opacity/radius/elevation.
 */
export const SHADOW = {
  poster: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  hero: {
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 16,
  },
  header: {
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
  },
} as const;
