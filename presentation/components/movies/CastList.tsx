import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { MovieCredits } from '@/core/entities/movie-credits.entity';

interface Props {
  cast: MovieCredits[];
}

const CastItem = ({ member }: { member: MovieCredits }) => {
  const hasPicture = member.picture && member.picture !== 'no-foto';

  return (
    <View className="items-center" style={{ width: 80 }}>
      {hasPicture ? (
        <Image
          source={{ uri: member.picture }}
          style={{ width: 56, height: 56, borderRadius: 28 }}
          className="bg-line"
          contentFit="cover"
        />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-full bg-line">
          <Text className="font-editorial text-sm text-ink-soft">
            {member.name.charAt(0)}
          </Text>
        </View>
      )}
      <Text
        className="mt-2 text-center font-editorial text-sm text-ink"
        numberOfLines={2}>
        {member.name}
      </Text>
      {member.character ? (
        <Text
          className="mt-0.5 text-center font-editorial text-xs text-ink-soft"
          numberOfLines={2}>
          {member.character}
        </Text>
      ) : null}
    </View>
  );
};

const CastList = ({ cast }: Props) => {
  if (cast.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(200)}
      className="mt-8">
      <Text className="font-editorial uppercase tracking-[3px] text-accent">
        Reparto
      </Text>
      <View className="mt-2 h-px bg-line" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerClassName="gap-4">
        {cast
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
          .map((member, index) => (
            <CastItem key={`${member.name}-${index}`} member={member} />
          ))}
      </ScrollView>
    </Animated.View>
  );
};

export default CastList;
