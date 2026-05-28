import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/config/theme/colors';

const SectionLoader = () => (
  <View className="h-72 items-center justify-center">
    <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
  </View>
);

export default SectionLoader;
