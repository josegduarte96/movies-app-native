import { View } from 'react-native';

import { Movie } from '@/core/entities/movie.entity';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import Poster from './Poster';

interface Props {
  movie: Movie;
  width?: number;
  onPress?: () => void;
}

const POSTER_RATIO = 1.5;

const formatYear = (date: Date): string => {
  const year = date.getFullYear();
  return Number.isNaN(year) ? '' : String(year);
};

/**
 * Tarjeta de cartelera: póster TMDB (radio 13, sombra, spring al pulsar vía
 * <Poster/>) con caption a la izquierda — título serif bold y año en ink-soft.
 * Ancho fijo (firma del carrusel: 150px). Sin caja ni borde alrededor del texto.
 */
const PosterCard = ({ movie, width = 150, onPress }: Props) => {
  const height = Math.round(width * POSTER_RATIO);
  const year = formatYear(movie.releaseDate);

  return (
    <View style={{ width }}>
      <Poster movie={movie} width={width} height={height} onPress={onPress} />
      <ThemedText
        numberOfLines={1}
        style={{ fontSize: 16, lineHeight: 20 }}
        className="mt-2.5 font-display">
        {movie.title}
      </ThemedText>
      {year ? (
        <ThemedText
          tone="soft"
          style={{ fontSize: 14, fontVariant: ['tabular-nums'] }}
          className="mt-0.5 font-editorial">
          {year}
        </ThemedText>
      ) : null}
    </View>
  );
};

export default PosterCard;
