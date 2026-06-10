// Port de ScreenHeader (hivo-design/ui.jsx:87-103).
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { screenInset, type } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        {subtitle ? <Text style={[type.xs, styles.subtitle]}>{subtitle}</Text> : null}
        <Text style={type.h1}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: screenInset,
    paddingBottom: 14,
  },
  subtitle: { marginBottom: 4 },
});
