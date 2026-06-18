import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { ThemedIcon } from '@/presentation/components/ui/ThemedIcon';
import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { EYEBROW } from '@/presentation/constants/typography';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  body: string;
}

/**
 * Estado a pantalla completa (error / vacío / sin resultados). Un único layout
 * centrado: ícono outline 40px en rojo ladrillo, etiqueta tracked en mayúsculas
 * y una frase de cuerpo en ink-soft. Error y vacío comparten layout; sólo
 * cambian ícono y copy (regla del design system).
 */
const StateBlock = ({ icon, label, body }: Props) => {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(280)}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}. ${body}`}
      className="items-center px-10 py-24">
      <ThemedIcon tone="accent" name={icon} size={40} />
      <ThemedText
        tone="accent"
        style={EYEBROW}
        className="mt-4 font-editorial uppercase">
        {label}
      </ThemedText>
      <ThemedText
        tone="soft"
        style={{ maxWidth: 320 }}
        className="mt-2 text-center font-editorial text-[15px] leading-6">
        {body}
      </ThemedText>
    </Animated.View>
  );
};

export default StateBlock;
