import { Platform, View } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  backdropPath: string;
  heroHeight: number;
}

const MovieDetailHero = ({ backdropPath, heroHeight }: Props) => {
  return (
    <View
      style={{
        height: heroHeight,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          },
          android: {
            elevation: 24,
          },
        }),
      }}>
      <View
        className="overflow-hidden rounded-b-[3%]"
        style={{ height: heroHeight }}>
        <Image
          source={{ uri: backdropPath }}
          style={{ width: '100%', height: '100%' }}
          transition={500}
          contentFit="cover"
        />
      </View>
    </View>
  );
};

export default MovieDetailHero;
