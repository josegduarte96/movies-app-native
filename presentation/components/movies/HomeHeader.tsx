import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useTheme } from '@/presentation/providers/theme-provider';

interface Props {
  topInset: number;
  onSearch: () => void;
}

const NAMEPLATE_REST = 30;

const HomeHeader = ({ topInset, onSearch }: Props) => {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      accessible
      accessibilityRole="header"
      accessibilityLabel={'Cinemateca'}
      style={[
        {
          paddingTop: topInset,
          zIndex: 10,
          backgroundColor: colors.paper,
          shadowColor: colors.ink.DEFAULT,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 22,
        },
      ]}
      className="px-6 pb-2.5">
      <Animated.View className="overflow-hidden">
        <Animated.Text
          numberOfLines={1}
          style={[
            {
              fontSize: NAMEPLATE_REST,
              lineHeight: NAMEPLATE_REST,
              letterSpacing: -0.5,
              transformOrigin: 'left top',
              color: colors.ink.DEFAULT,
            },
          ]}
          className="font-display">
          Cinemateca
        </Animated.Text>
      </Animated.View>

      <Animated.View className="overflow-hidden">
        <View>
          <View
            className="mb-3 mt-3.5 h-[3px] w-16"
            style={{ backgroundColor: colors.accent.DEFAULT }}
          />
          <Text
            className="font-editorial-italic text-xl"
            style={{ color: colors.ink.soft }}>
            una sala de repertorio
          </Text>
        </View>
      </Animated.View>

      <Pressable
        onPress={onSearch}
        accessibilityRole="button"
        accessibilityLabel="Buscar películas"
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
          borderColor: colors.line,
          backgroundColor: colors.paper,
        })}
        className="mb-1.5 mt-6 flex-row items-center rounded-xl border-[1.5px] border-ink-soft px-4 py-3">
        <Ionicons name="search-outline" size={19} color={colors.ink.soft} />
        <Text
          style={{ fontSize: 16, color: colors.ink.soft }}
          className="ml-2.5 font-editorial">
          Buscar películas
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default HomeHeader;
