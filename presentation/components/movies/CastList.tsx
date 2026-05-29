import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import type { MovieCredits } from '@/core/entities/movie-credits.entity';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { useTheme } from '@/presentation/providers/theme-provider';

interface Props {
  cast: MovieCredits[];
}

const AVATAR = 68;

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

const CastItem = ({ member }: { member: MovieCredits }) => {
  const { colors } = useTheme();
  const hasPicture = member.picture && member.picture !== 'no-foto';

  return (
    <View className="items-center" style={{ width: 88 }}>
      {hasPicture ? (
        <Image
          source={{ uri: member.picture }}
          style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, backgroundColor: colors.line }}
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
          <ThemedText tone="soft" style={{ fontSize: 20 }} className="font-editorial">
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
    </View>
  );
};

const CastList = ({ cast }: Props) => {
  const reducedMotion = useReducedMotion();
  if (cast.length === 0) return null;

  const ordered = [...cast].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(500).delay(120)}
      className="mt-7">
      <ThemedText
        tone="accent"
        style={{ fontSize: 12, letterSpacing: 3 }}
        className="font-editorial uppercase">
        Reparto
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3.5"
        contentContainerStyle={{ gap: 18, paddingBottom: 4 }}>
        {ordered.map((member, index) => (
          <CastItem key={`${member.name}-${index}`} member={member} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default CastList;
