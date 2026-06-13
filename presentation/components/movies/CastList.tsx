import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { MovieCredits } from '@/core/entities/movie-credits.entity';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { useTheme } from '@/presentation/providers/theme-provider';

interface Props {
  cast: MovieCredits[];
}

const AVATAR = 68;
// Velocidad del autoplay del carrusel de reparto (px/s). Lento, tipo marquesina.
const AUTO_SPEED = 100;
// Inactividad tras interacción manual antes de reanudar el autoplay.
const RESUME_DELAY = 2500;

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

const CastItem = ({
  member,
  index,
  reducedMotion,
}: {
  member: MovieCredits;
  index: number;
  reducedMotion: boolean;
}) => {
  const { colors } = useTheme();
  const hasPicture = member.picture && member.picture !== 'no-foto';
  // Entrada en cascada: cada rostro 55ms tras el anterior (tope a los 8
  // primeros para no encadenar retardos largos en repartos extensos).
  const entering = reducedMotion
    ? undefined
    : FadeInDown.duration(420).delay(Math.min(index, 8) * 55);

  return (
    <Animated.View
      entering={entering}
      className="items-center"
      style={{ width: 88 }}>
      {hasPicture ? (
        <Image
          source={{ uri: member.picture }}
          style={{
            width: AVATAR,
            height: AVATAR,
            borderRadius: AVATAR / 2,
            backgroundColor: colors.line,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          style={{
            width: AVATAR,
            height: AVATAR,
            borderRadius: AVATAR / 2,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.line,
          }}
          className="items-center justify-center">
          <ThemedText
            tone="soft"
            style={{ fontSize: 20 }}
            className="font-editorial">
            {initials(member.name)}
          </ThemedText>
        </View>
      )}
      <ThemedText
        numberOfLines={2}
        style={{ fontSize: 13, lineHeight: 16 }}
        className="mt-2 text-center font-display">
        {member.name}
      </ThemedText>
      {member.character ? (
        <ThemedText
          tone="soft"
          numberOfLines={2}
          style={{ fontSize: 12, lineHeight: 15 }}
          className="mt-0.5 text-center font-editorial-italic">
          {member.character}
        </ThemedText>
      ) : null}
    </Animated.View>
  );
};

const CastList = ({ cast }: Props) => {
  const reducedMotion = useReducedMotion();

  const aref = useAnimatedRef<Animated.ScrollView>();
  const offset = useSharedValue(0);
  const paused = useSharedValue(false);
  const [containerW, setContainerW] = useState(0);
  const [contentW, setContentW] = useState(0);
  const maxScroll = Math.max(0, contentW - containerW);

  // Empuja el scroll en el hilo de UI siguiendo `offset`, salvo cuando el dedo
  // tiene el control (paused) para no pelear con el arrastre manual.
  useDerivedValue(() => {
    // maxScroll > 0 evita disparar scrollTo antes del layout (ref aún sin
    // inicializar) y solo empuja cuando el autoplay tiene el control.
    if (!paused.value && maxScroll > 0) scrollTo(aref, offset.value, 0, false);
  });

  // Vaivén lento de 0 → maxScroll → 0 a velocidad constante. Sin salto brusco
  // al llegar al final gracias al reverse del withRepeat.
  const startAuto = useCallback(() => {
    cancelAnimation(offset);
    const duration = (maxScroll / AUTO_SPEED) * 1000;
    offset.value = withRepeat(
      withTiming(maxScroll, { duration, easing: Easing.linear }),
      -1,
      true,
    );
  }, [maxScroll, offset]);

  // Arranca/relanza el autoplay solo si hay overflow real y no está activo el
  // modo de accesibilidad de movimiento reducido.
  useEffect(() => {
    if (reducedMotion || maxScroll <= 0) {
      cancelAnimation(offset);
      return;
    }
    startAuto();
    return () => cancelAnimation(offset);
  }, [reducedMotion, maxScroll, startAuto, offset]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      // Mientras el usuario tiene el control, sincroniza `offset` con la
      // posición real para reanudar el vaivén sin teletransportes.
      if (paused.value) offset.value = e.contentOffset.x;
    },
  });

  // Cancela cualquier reanudación pendiente al desmontar.
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  // Al tocar: detiene el autoplay y cede el control (deja correr el momentum).
  const pauseAuto = () => {
    paused.value = true;
    cancelAnimation(offset);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };
  // Reanuda solo tras un rato de inactividad, no al soltar el dedo.
  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.value = false;
      startAuto();
    }, RESUME_DELAY);
  };

  if (cast.length === 0) return null;

  const ordered = [...cast].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(400)}
      className="mt-7">
      <ThemedText
        tone="accent"
        style={{ fontSize: 12, letterSpacing: 3 }}
        className="px-6 font-editorial uppercase">
        Reparto
      </ThemedText>
      <Animated.ScrollView
        ref={aref}
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onTouchStart={pauseAuto}
        onScrollBeginDrag={pauseAuto}
        onScrollEndDrag={scheduleResume}
        onMomentumScrollEnd={scheduleResume}
        onTouchEnd={scheduleResume}
        onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentW(w)}
        className="mt-3.5"
        contentContainerStyle={{ gap: 18, paddingBottom: 4 }}>
        {ordered.map((member, index) => (
          <CastItem
            key={`${member.name}-${index}`}
            member={member}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default CastList;
