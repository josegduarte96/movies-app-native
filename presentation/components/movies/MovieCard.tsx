import { Text, View } from 'react-native';
import { Movie } from '@/core/entities/movie.entity';
import Poster from './Poster';

interface Props {
  movie: Movie;
  width: number;
  posterRatio: number;
  onPress?: () => void;
}

const formatYear = (date: Date): string => {
  const year = date.getFullYear();
  return Number.isNaN(year) ? '' : String(year);
};

const MovieCard = ({ movie, width, posterRatio = 1.5, onPress }: Props) => {
  const height = Math.round(width * posterRatio);
  const year = formatYear(movie.releaseDate);

  return (
    <View className="flex-1 items-center justify-start pt-4">
      <Poster movie={movie} width={width} height={height} onPress={onPress} />
      <View style={{ width }} className="mt-2">
        <Text className="text-left text-base font-medium text-ink">{movie.title}</Text>
        {year ? (
          <Text className="mt-1 text-left text-sm font-semibold text-ink-soft">{year}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default MovieCard;
