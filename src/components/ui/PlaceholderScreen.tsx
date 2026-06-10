// Pantalla provisional para tabs aún no portadas del prototipo.
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from './ScreenHeader';
import { colors, screenInset, type } from '@/theme';

export function PlaceholderScreen({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title={title} />
      <Text style={[type.sm, styles.note]}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  note: {
    paddingHorizontal: screenInset,
  },
});
