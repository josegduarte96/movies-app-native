import { useCallback, useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import SearchBar from './SearchBar';

interface Props {
  onQueryChange: (query: string) => void;
}

const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

// La portada del programa: sesión (etiqueta roja), fecha y nameplate.
const useMasthead = () => {
  const [masthead, setMasthead] = useState({
    session: '',
    date: '',
    spoken: '',
  });

  const compute = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const session =
      hour < 12 ? 'Matiné' : hour < 19 ? 'Sesión de tarde' : 'Sesión de noche';
    const month = SPANISH_MONTHS[now.getMonth()];
    const date = `${now.getDate()} ${month} ${now.getFullYear()}`;
    setMasthead({
      session,
      date,
      spoken: `Cinemateca, ${session}, ${now.getDate()} de ${month}`,
    });
  }, []);

  useEffect(() => {
    compute();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') compute();
    });
    return () => sub.remove();
  }, [compute]);

  return masthead;
};

const HomeHeader = ({ onQueryChange }: Props) => {
  const reducedMotion = useReducedMotion();
  const { session, date, spoken } = useMasthead();

  // Reveal escalonado; respeta reduce-motion.
  const reveal = (delay: number) =>
    reducedMotion ? undefined : FadeInDown.duration(380).delay(delay);

  return (
    <View className="border-b border-line">
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={spoken || 'Cinemateca'}
        className="px-6 pt-4">
        {/* Folio: sesión (rojo) a la izquierda, fecha a la derecha.
            Banda de cabecera cerrada por un hairline. */}
        <Animated.View
          entering={reveal(0)}
          className="flex-row items-baseline justify-between border-b border-line pb-3">
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, letterSpacing: 3 }}
            className="font-editorial uppercase text-accent">
            {session}
          </Text>
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 2,
              fontVariant: ['tabular-nums'],
            }}
            className="font-editorial uppercase text-ink-soft">
            {date}
          </Text>
        </Animated.View>

        {/* Nameplate: sobredimensionado, la voz única de la portada. */}
        <Animated.Text
          entering={reveal(70)}
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ fontSize: 48, lineHeight: 50, letterSpacing: -0.5 }}
          className="mt-5 font-display text-ink">
          Cinemateca
        </Animated.Text>

        {/* Regla roja pesada: dispositivo firma del masthead (spot color). */}
        <Animated.View
          entering={reveal(140)}
          className="mt-3 h-[3px] w-16 bg-accent"
        />

        {/* Standfirst: único itálico del sistema, nota curatorial. */}
        <Animated.Text
          entering={reveal(190)}
          numberOfLines={1}
          className="mb-1 mt-3 font-editorial-italic text-sm text-ink-soft">
          una sala de repertorio
        </Animated.Text>
      </View>

      <SearchBar onQueryChange={onQueryChange} />
    </View>
  );
};

export default HomeHeader;
