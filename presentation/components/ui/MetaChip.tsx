import { ThemedText } from '@/presentation/components/ui/ThemedText';
import { ThemedView } from '@/presentation/components/ui/ThemedView';

interface Props {
  label: string;
}

/**
 * Chip de metadato: relleno hairline, texto serif, radio 4px (chip). Plano —
 * cero elevación (Flat-Chrome). Para runtime, año, estado e idiomas en Detalle.
 */
const MetaChip = ({ label }: Props) => {
  return (
    <ThemedView bg="line" className="rounded-full px-3 py-2">
      <ThemedText style={{ fontSize: 15 }} className="font-editorial">
        {label}
      </ThemedText>
    </ThemedView>
  );
};

export default MetaChip;
